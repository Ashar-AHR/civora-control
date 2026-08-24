import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';

export function AccessDeniedPage() {
  const navigate = useNavigate();
  const { denial, signOut } = useAuth();
  const onReturn = async () => {
    await signOut();
    void navigate('/sign-in', { replace: true });
  };
  return (
    <main className="state-page">
      <section className="state-card">
        <div className="state-symbol" aria-hidden="true">!</div>
        <h1>Access not available</h1>
        <p>{denial?.message ?? 'Your account is not authorized for this commercial workspace.'}</p>
        <p className="reference">Reference: {denial?.reference ?? 'ACCESS-01'}</p>
        <button className="button button-primary" type="button" onClick={() => void onReturn()}>Return to sign in</button>
      </section>
    </main>
  );
}
