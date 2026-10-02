import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import HeroImage from '../assets/HeroSection.png';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="site-shell"><Navbar /><main className="page-content container" style={{ paddingTop: 34, paddingBottom: 65 }}><div className="auth-layout"><div className="auth-art"><img src={HeroImage} alt="A laptop from the GlowGears collection" /><h2>Good to see you again.</h2></div><div className="auth-form-panel"><form className="auth-form" onSubmit={handleLogin}><span className="eyebrow">Welcome back</span><h1>Log in.</h1><p>Sign in to manage your account and orders.</p><div className="form-field"><label htmlFor="login-email">Email address</label><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div><div className="form-field"><label htmlFor="login-password">Password</label><input id="login-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn btn-dark" disabled={loading} style={{ width: '100%' }}>{loading ? 'Signing in…' : 'Log in'}</button><p className="auth-switch">New around here? <Link to="/signup">Create an account</Link></p></form></div></div></main><Footer /></div>;
}
