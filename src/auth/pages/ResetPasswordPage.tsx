import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await resetPassword(email);
    setSent(true);
  };
  return (
    <main className="state-page">
      <form className="state-card reset-card" onSubmit={(event) => void submit(event)}>
        <div className="brand-mark">CC</div>
        <h1>Reset access</h1>
        <p>Enter your approved ERP email address.</p>
        {sent ? (
          <div className="alert alert-success">If the address is eligible, reset instructions will be sent.</div>
        ) : (
          <>
            <label htmlFor="reset-email">Email address</label>
            <input id="reset-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <button className="button button-primary button-full" type="submit">Send reset link</button>
          </>
        )}
        <Link to="/sign-in">Back to sign in</Link>
      </form>
    </main>
  );
}
