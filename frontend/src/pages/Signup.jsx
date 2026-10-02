import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';
import HeroImage from '../assets/HeroSection.png';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      await signup(email.trim(), password, name.trim());
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to create your account.');
    } finally {
      setLoading(false);
    }
  };

  return <div className="site-shell"><Navbar /><main className="page-content container" style={{ paddingTop: 34, paddingBottom: 65 }}><div className="auth-layout"><div className="auth-art"><img src={HeroImage} alt="A laptop from the GlowGears collection" /><h2>Make room for better gear.</h2></div><div className="auth-form-panel"><form className="auth-form" onSubmit={handleSignup}><span className="eyebrow">Come on in</span><h1>Create an account.</h1><p>Your account and order details will be available wherever you sign in.</p><div className="form-field"><label htmlFor="signup-name">Full name</label><input id="signup-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" minLength={2} maxLength={80} required /></div><div className="form-field"><label htmlFor="signup-email">Email address</label><input id="signup-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></div><div className="form-field"><label htmlFor="signup-password">Password</label><input id="signup-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /><small>Use at least 8 characters.</small></div><div className="form-field"><label htmlFor="signup-confirm">Confirm password</label><input id="signup-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required /></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="btn btn-dark" disabled={loading} style={{ width: '100%' }}>{loading ? 'Creating account…' : 'Create account'}</button><p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p></form></div></div></main><Footer /></div>;
}
