import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();
  if (loading) return <main className="container info-page"><section className="info-panel"><span className="eyebrow">Your account</span><h1>Checking your session…</h1></section></main>;
  if (!user) return <main className="container info-page"><section className="info-panel"><span className="eyebrow">Sign in required</span><h1>Please log in to continue.</h1><p>This area is available after you sign in.</p><Link className="btn btn-dark" to="/login">Log in</Link></section></main>;
  if (!allowedRoles.includes(role)) return <main className="container info-page"><section className="info-panel"><span className="eyebrow">Access restricted</span><h1>You do not have permission to open this page.</h1><p>Your account is signed in, but it does not have the required role.</p><Link className="btn btn-dark" to="/">Back to home</Link></section></main>;
  return children;
}
