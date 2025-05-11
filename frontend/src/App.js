import React, { useState, useEffect } from 'react';
import './App.css';

// Styles CSS
const styles = {
  container: {
    maxWidth: '400px',
    margin: '50px auto',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '30px',
    fontSize: '28px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#34495e',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '16px',
    transition: 'border-color 0.3s ease',
    ':focus': {
      borderColor: '#3498db',
      outline: 'none',
    },
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    flex: 1,
    padding: '12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  loginButton: {
    backgroundColor: '#3498db',
    color: 'white',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  registerButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    ':hover': {
      backgroundColor: '#27ae60',
    },
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    ':hover': {
      backgroundColor: '#c0392b',
    },
  },
  message: {
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  error: {
    backgroundColor: '#fde8e8',
    color: '#e53e3e',
  },
  success: {
    backgroundColor: '#e6ffed',
    color: '#2ecc71',
  },
  welcomeContainer: {
    textAlign: 'center',
  },
  userEmail: {
    color: '#3498db',
    marginBottom: '20px',
  },
};

function App({ supabase }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRegister, setShowRegister] = useState(false);

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
      <div className="app-bg">
        <div className="auth-card">
          <div className="welcome-container">
            <h1 className="auth-title">Bienvenue !</h1>
            <p className="user-email">Vous êtes connecté avec l'email : {user.email}</p>
            <button 
              onClick={handleLogout}
              className="main-btn logout-btn"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-bg">
      <div className="auth-card">
        <h1 className="auth-title">{showRegister ? 'Inscription' : 'Connexion'}</h1>
        {error && <div className="msg error">{error}</div>}
        {success && <div className="msg success">{success}</div>}
        <form className="auth-form" onSubmit={showRegister ? handleRegister : handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <div className="input-icon">
              <span className="icon">@</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Entrez votre email"
                required
              />
            </div>
          </div>
          <div className="input-group">
            <label>Mot de passe</label>
            <div className="input-icon">
              <span className="icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez votre mot de passe"
                required
              />
            </div>
          </div>
          <button className="main-btn" type="submit">
            {showRegister ? 'Inscription' : 'Connexion'}
          </button>
        </form>
        <div className="switch-link">
          {showRegister ? (
            <span>Vous avez déjà un compte ? <button type="button" onClick={() => setShowRegister(false)}>Connectez-vous</button></span>
          ) : (
            <span>Vous n'avez pas de compte ? <button type="button" onClick={() => setShowRegister(true)}>Inscrivez-vous</button></span>
          )}
        </div>
      </div>
    </div>
  );
}

export default App; 