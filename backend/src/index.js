const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erreur: Les variables d\'environnement SUPABASE_URL et SUPABASE_KEY sont requises');
  process.exit(1);
}

console.log('URL Supabase:', supabaseUrl);
console.log('Clé Supabase:', supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

app.use(cors());
app.use(express.json());

// Route d'inscription
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.FRONTEND_URL || 'http://localhost'}/auth/callback`,
        data: {
          email_confirmed: false
        }
      }
    });

    if (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }

    res.json({ 
      message: 'Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.',
      user: data 
    });
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(400).json({ error: error.message });
  }
});

// Route de connexion
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }

    res.json({ message: 'Connexion réussie', user: data });
  } catch (error) {
    console.error('Erreur complète:', error);
    res.status(400).json({ error: error.message });
  }
});

// Route pour obtenir les informations de l'utilisateur
app.get('/api/user', async (req, res) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
}); 