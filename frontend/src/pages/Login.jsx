import React, { useState } from 'react';
import { KeyRound, Mail, Sparkles, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Determine current clinic tenant subdomain from URL
  const host = window.location.hostname;
  const subdomain = host.split('.')[0];
  const isSassMaster = subdomain === 'www' || subdomain === 'localhost' || host.split('.').length === 1;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulate login and redirect
    setTimeout(() => {
      if (email && password) {
        setLoading(false);
        // Save auth data
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', 'DENTIST');
        // Redirect to clinic portal dashboard
        navigate('/dashboard');
      } else {
        setLoading(false);
        setError('Credenciales inválidas. Por favor verifique e intente de nuevo.');
      }
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box animate-fade-in">
        <div className="login-brand">
          <h1>Odontolog<span className="logo-highlight">IA</span></h1>
          <p className="login-suite">Clinical Suite</p>
          {!isSassMaster && (
            <span className="tenant-badge">Clínica: {subdomain.toUpperCase()}</span>
          )}
        </div>

        <form onSubmit={handleLoginSubmit} className="login-form">
          {error && (
            <div className="login-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input 
                type="email" 
                placeholder="ejemplo@odontologia.ai" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <KeyRound size={16} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-login" disabled={loading}>
            {loading ? 'Iniciando Sesión...' : 'Ingresar al Portal Clínico'}
          </button>
        </form>

        <div className="login-footer">
          <Sparkles size={14} className="text-accent" />
          <span>Seguridad asistida por IA & Cifrado de Datos</span>
        </div>
      </div>
    </div>
  );
}
