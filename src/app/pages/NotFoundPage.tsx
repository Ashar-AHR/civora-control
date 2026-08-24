import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <section className="card empty-page"><h1>Module not available in this release</h1><p>The requested route is not enabled for the current Foundation release.</p><Link className="button button-primary" to="/">Return home</Link></section>;
}
