import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import { updateOrdinarySettings } from '../../data/repositories/systemSettingsRepository';

export function SystemConfigurationPage() {
  const { identity, project, revalidate } = useAuth();
  const settings = project?.settings;
  const [threshold, setThreshold] = useState(settings?.budgetWarningThresholdBp ?? 9000);
  const [searchLimit, setSearchLimit] = useState(settings?.searchPrefixLimit ?? 20);
  const [referenceLimit, setReferenceLimit] = useState(settings?.externalReferenceLimit ?? 250);
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  if (!identity || !project || !settings) return null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      await updateOrdinarySettings(identity, settings, {
        budgetWarningThresholdBp: threshold,
        searchPrefixLimit: searchLimit,
        externalReferenceLimit: referenceLimit,
        reason,
      });
      await revalidate();
      setMessage('Configuration updated with an audit record.');
    } catch {
      setMessage('The configuration was not saved. Reload the current version and try again.');
    }
  };

  return (
    <>
      <div className="breadcrumb">Control / System Configuration</div>
      <div className="page-heading"><div><h1>System Configuration</h1><p>Controlled P136 and application settings.</p></div></div>
      <section className="card config-card">
        <div className="config-grid">
          <div><span>Protected project</span><strong>{project.projectName} • P136</strong></div>
          <div><span>Currency / VAT</span><strong>SAR • {(project.vatRateBp / 100).toFixed(2)}%</strong></div>
          <div><span>Schema / calculation</span><strong>{project.schemaVersion} • {project.calculationVersion}</strong></div>
          <div><span>Enabled modules</span><strong>{settings.enabledModules.join(', ')}</strong></div>
        </div>
        <div className="alert alert-warning"><strong>Release-controlled:</strong> Schema version, calculation version and enabled modules cannot be changed through an ordinary form edit.</div>
        {message && <div className="alert alert-information" role="status">{message}</div>}
        <form className="settings-form" onSubmit={(event) => void submit(event)}>
          <label>Budget warning threshold (basis points)<input type="number" min="0" max="10000" value={threshold} onChange={(event) => setThreshold(Number(event.target.value))} /></label>
          <label>Search prefix limit<input type="number" min="1" max="20" value={searchLimit} onChange={(event) => setSearchLimit(Number(event.target.value))} /></label>
          <label>External reference limit<input type="number" min="1" max="500" value={referenceLimit} onChange={(event) => setReferenceLimit(Number(event.target.value))} /></label>
          <label>Reason for change<input type="text" maxLength={250} value={reason} onChange={(event) => setReason(event.target.value)} required /></label>
          <button className="button button-primary" type="submit" disabled={!reason.trim()}>Save proposal</button>
        </form>
      </section>
    </>
  );
}
