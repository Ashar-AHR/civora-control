export function SessionLoadingPage() {
  return (
    <main className="state-page" aria-busy="true">
      <section className="state-card">
        <div className="brand-mark">CC</div>
        <h1>Civora Control</h1>
        <p>Verifying secure access…</p>
        <div className="bootstrap-steps">Authentication <span>→</span> Profile <span>→</span> Project</div>
      </section>
    </main>
  );
}
