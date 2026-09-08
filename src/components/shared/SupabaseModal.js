import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, AlertTriangle, Copy, Check, ExternalLink, RefreshCw, X, ShieldAlert } from 'lucide-react';
import { testSupabaseWriteAccess } from '../../data/supabaseDatabase';

export default function SupabaseModal({ isOpen, onClose, onRefreshData }) {
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState(null);
  const [copied, setCopied] = useState(false);

  const runTest = async () => {
    setTesting(true);
    try {
      const res = await testSupabaseWriteAccess();
      setStatus(res);
      if (res.canRead && onRefreshData) {
        onRefreshData();
      }
    } catch (e) {
      setStatus({ connected: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runTest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const sqlScript = `-- 1. Allow Public/Anon Access to all HealthStory tables in Supabase
ALTER TABLE IF EXISTS public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.medications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all on hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Allow anon all on staff" ON public.staff;
DROP POLICY IF EXISTS "Allow anon all on patients" ON public.patients;
DROP POLICY IF EXISTS "Allow anon all on health_records" ON public.health_records;
DROP POLICY IF EXISTS "Allow anon all on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow anon all on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow anon all on allergies" ON public.allergies;
DROP POLICY IF EXISTS "Allow anon all on medications" ON public.medications;

CREATE POLICY "Allow anon all on hospitals" ON public.hospitals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on health_records" ON public.health_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on allergies" ON public.allergies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on medications" ON public.medications FOR ALL USING (true) WITH CHECK (true);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', backgroundColor: '#1C1C1E', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
              <Database size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0, color: '#FFF' }}>
                Supabase Cloud Database Connection
              </h3>
              <span style={{ fontSize: '11.5px', color: '#999' }}>Project: eemhwosqevyokesdlvfr.supabase.co</span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Status Diagnostic Card */}
          <div
            style={{
              padding: '18px',
              borderRadius: '14px',
              backgroundColor: status?.canWrite ? '#ECFDF5' : status?.rlsBlocked ? '#FEF3C7' : '#F9FAFB',
              border: `1px solid ${status?.canWrite ? '#A7F3D0' : status?.rlsBlocked ? '#FDE68A' : '#E5E7EB'}`,
              marginBottom: '20px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {status?.canWrite ? (
                  <CheckCircle2 size={20} color="#059669" />
                ) : status?.rlsBlocked ? (
                  <ShieldAlert size={20} color="#D97706" />
                ) : (
                  <AlertTriangle size={20} color="#DC2626" />
                )}
                <strong style={{ fontSize: '15px', color: status?.canWrite ? '#065F46' : status?.rlsBlocked ? '#92400E' : '#991B1B' }}>
                  {testing
                    ? 'Testing connection...'
                    : status?.canWrite
                    ? 'Fully Connected: Read & Write Active'
                    : status?.rlsBlocked
                    ? 'Connected, but RLS Policy is Blocking Writes'
                    : 'Connection Error'}
                </strong>
              </div>
              <button
                onClick={runTest}
                disabled={testing}
                className="btn btn-sm btn-outline"
                style={{ fontSize: '12px', padding: '4px 10px', height: 'auto' }}
              >
                <RefreshCw size={12} className={testing ? 'spin' : ''} /> {testing ? 'Testing...' : 'Re-test'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12.5px', color: '#374151' }}>
              <div>
                <span style={{ color: '#6B7280' }}>Read Access (SELECT):</span>{' '}
                <strong style={{ color: status?.canRead ? '#059669' : '#DC2626' }}>
                  {status?.canRead ? '✓ Verified (200 OK)' : 'Pending'}
                </strong>
              </div>
              <div>
                <span style={{ color: '#6B7280' }}>Write Access (INSERT):</span>{' '}
                <strong style={{ color: status?.canWrite ? '#059669' : '#D97706' }}>
                  {status?.canWrite ? '✓ Verified (200 OK)' : '⚠ Blocked by RLS (42501)'}
                </strong>
              </div>
            </div>
          </div>

          {/* If RLS is blocked: Instructions and SQL Script */}
          {status?.rlsBlocked && (
            <div>
              <div style={{ marginBottom: '14px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111', margin: '0 0 4px 0' }}>
                  Why is this happening?
                </h4>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5, margin: 0 }}>
                  Supabase has PostgreSQL Row-Level Security (RLS) enabled on your tables by default. Because no <code>INSERT</code> policy has been configured yet, PostgreSQL blocks new patient registrations and record insertions.
                </p>
              </div>

              <div style={{ backgroundColor: '#F3F4F6', padding: '14px', borderRadius: '12px', marginBottom: '16px', border: '1px solid #E5E7EB' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 8px 0', color: '#111' }}>
                  Quick 2-Step Fix:
                </h5>
                <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                  <li>
                    Open your Supabase SQL Editor:{' '}
                    <a
                      href="https://supabase.com/dashboard/project/eemhwosqevyokesdlvfr/sql"
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                    >
                      Supabase SQL Editor <ExternalLink size={12} />
                    </a>
                  </li>
                  <li>Click <strong>Copy SQL Script</strong> below, paste it into the editor, and click <strong>RUN</strong>.</li>
                </ol>
              </div>

              <div style={{ position: 'relative', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: 'none', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563', textTransform: 'uppercase' }}>
                    SQL RLS Policy Script
                  </span>
                  <button
                    onClick={handleCopy}
                    className="btn btn-sm btn-primary"
                    style={{ fontSize: '12px', padding: '4px 12px', height: 'auto' }}
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                    {copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}
                  </button>
                </div>
                <pre
                  style={{
                    backgroundColor: '#1C1C1E',
                    color: '#E5E7EB',
                    padding: '14px',
                    borderRadius: '10px',
                    fontSize: '11.5px',
                    lineHeight: 1.4,
                    overflowX: 'auto',
                    maxHeight: '160px',
                    margin: 0
                  }}
                >
                  {sqlScript}
                </pre>
              </div>
            </div>
          )}

          {/* Quick Table Links */}
          <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <strong style={{ fontSize: '13px', color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={15} color="#2563EB" /> Supabase Database Tables:
              </strong>
              <a
                href="https://supabase.com/dashboard/project/eemhwosqevyokesdlvfr/editor"
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '12px', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Open Supabase Table Editor <ExternalLink size={12} />
              </a>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
              {[
                { name: 'patients', label: 'Patients' },
                { name: 'health_records', label: 'Health Records' },
                { name: 'allergies', label: 'Allergies' },
                { name: 'medications', label: 'Medications' },
                { name: 'documents', label: 'Documents' },
                { name: 'audit_logs', label: 'Audit Logs' }
              ].map((t) => (
                <a
                  key={t.name}
                  href={`https://supabase.com/dashboard/project/eemhwosqevyokesdlvfr/editor`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    padding: '8px 10px',
                    fontSize: '12px',
                    color: '#334155',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{t.name}</span>
                  <ExternalLink size={11} color="#94A3B8" />
                </a>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-outline">
              Close
            </button>
            {status?.rlsBlocked ? (
              <button onClick={runTest} className="btn btn-primary">
                <RefreshCw size={14} /> Re-check After Running SQL
              </button>
            ) : (
              <a
                href="https://supabase.com/dashboard/project/eemhwosqevyokesdlvfr/editor"
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> View Tables in Supabase
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
