import { useState, type FormEvent } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function SignInPage() {
  const { status, signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (status === 'authorized') return <Navigate to="/" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch {
      setError('Sign-in was not completed. Check your details or contact the ERP administrator.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand-mark">CC</div>
        <h1>Civora<br />Control</h1>
        <p>A focused, secure workspace for controlled commercial records and management reporting.</p>
        <span className="privacy-pill">Protected project identity appears after authorization</span>
      </section>
      <section className="auth-panel">
        <form className="auth-card" onSubmit={(event) => void submit(event)} noValidate>
          <h2>Sign in</h2>
          <p>Use your approved commercial ERP account.</p>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input id="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            <button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
          <button className="button button-primary button-full" type="submit" disabled={submitting || !email || !password}>
            {submitting ? 'Verifying…' : 'Sign in'}
          </button>
          <div className="auth-footer"><Link to="/reset-password">Forgot password?</Link><span>Session-only access</span></div>
          <small>Authorized users only • No self-registration</small>
        </form>
      </section>
    </main>
  );
}
