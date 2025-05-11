import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function App({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Vérifier la session au chargement
    const session = supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;

      setSuccess('Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.');
      setUser(data.user);
    } catch (err) {
      console.error('Erreur d\'inscription:', err);
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      setSuccess('Connexion réussie');
      setUser(data.user);
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(err.message || 'Une erreur est survenue lors de la connexion');
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setSuccess('Déconnexion réussie');
    } catch (err) {
      setError(err.message);
    }
  };

  if (user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h4" gutterBottom>Bienvenue !</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Vous êtes connecté avec l'email : <b>{user.email}</b>
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
          >
            Déconnexion
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 4, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">
          Authentification
        </Typography>
        <Stack spacing={2} sx={{ mb: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Stack>
        <Box component="form" noValidate autoComplete="off">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            autoFocus
          />
          <TextField
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LoginIcon />}
              onClick={handleLogin}
              fullWidth
            >
              Connexion
            </Button>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<PersonAddIcon />}
              onClick={handleRegister}
              fullWidth
            >
              Inscription
            </Button>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
}

export default App; 