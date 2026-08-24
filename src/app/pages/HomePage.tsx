import { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { subscribeOwnInbox, type WorkItemSummary } from '../../data/repositories/workItemRepository';

export function HomePage() {
  const { identity, project } = useAuth();
  const [items, setItems] = useState<readonly WorkItemSummary[]>([]);
  const [inboxError, setInboxError] = useState(false);

  useEffect(() => {
    if (!identity) return;
    return subscribeOwnInbox(identity.uid, setItems, () => setInboxError(true));
  }, [identity]);

  return (
    <>
      <div className="breadcrumb">Home / Commercial Inbox</div>
      <div className="page-heading">
        <div><h1>Good afternoon, {identity?.displayName}</h1><p>Your secure commercial workspace.</p></div>
      </div>
      {inboxError && <div className="alert alert-warning">The inbox could not be refreshed. Other released pages remain available.</div>}
      <div className="dashboard-grid">
        <section className="card">
          <header><h2>My commercial inbox</h2><span className="status-live">● Live</span></header>
          {items.length === 0 ? (
            <div className="empty-state"><span>✓</span><strong>No assigned commercial actions</strong><p>Workflow items will appear here when their modules are released.</p></div>
          ) : (
            <ul className="inbox-list">{items.map((item) => <li key={item.id}><strong>{item.workItemType}</strong><span>{item.status}</span></li>)}</ul>
          )}
        </section>
        <section className="card">
          <header><h2>Foundation status</h2><span className="status-ok">Secure</span></header>
          <dl className="status-list">
            <div><dt>Identity and P136 scope</dt><dd>Verified</dd></div>
            <div><dt>Current role</dt><dd>{identity?.role === 'commercial_manager' ? 'CM' : 'Senior QS'}</dd></div>
            <div><dt>Enabled modules</dt><dd>{project?.settings.enabledModules.join(', ')}</dd></div>
            <div><dt>Business records</dt><dd>Not released</dd></div>
          </dl>
        </section>
      </div>
      <div className="alert alert-information">Released modules will appear only after their individual approval, testing and controlled release.</div>
    </>
  );
}
