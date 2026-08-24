export function SessionWarning({ onContinue, onSignOut }: { onContinue: () => void; onSignOut: () => void }) {
  return (
    <div className="session-warning" role="alertdialog" aria-modal="true" aria-labelledby="session-title">
      <h2 id="session-title">Your session will end in 5 minutes</h2>
      <p>No activity has been detected. Continue only if you are still using this secure commercial workspace.</p>
      <div className="button-row">
        <button className="button button-secondary" type="button" onClick={onSignOut}>Sign out</button>
        <button className="button button-primary" type="button" onClick={onContinue}>Continue session</button>
      </div>
    </div>
  );
}
