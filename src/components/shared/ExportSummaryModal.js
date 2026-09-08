import React from 'react';
import { X, Printer, ShieldCheck, Heart, AlertTriangle, Activity, Pill, Scissors } from 'lucide-react';

export default function ExportSummaryModal({ isOpen, patient, records, onClose }) {
  if (!isOpen || !patient) return null;

  const handlePrint = () => {
    window.print();
  };

  const surgeries = records.filter(r => r.type === 'SURGERY');
  const allergies = patient.allergies || [];
  const activeMeds = (patient.medications || []).filter(m => m.status === 'Active');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '850px', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Control Bar */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            backgroundColor: '#1E1F22',
            color: '#FFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Heart size={18} color="var(--accent-primary)" fill="var(--accent-primary)" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Official Longitudinal Health Summary</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-sm btn-primary">
              <Printer size={15} /> Print / Save as PDF
            </button>
            <button onClick={onClose} className="btn btn-sm btn-dark" style={{ background: '#333' }}>
              <X size={16} /> Close
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div style={{ padding: '36px', backgroundColor: '#FFFFFF', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #111', paddingBottom: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 900, letterSpacing: '-0.03em', color: '#111' }}>
                HealthStory™
              </div>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', fontWeight: 600, marginTop: '2px' }}>
                Centralized Longitudinal Patient Health Record
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#777' }}>Generated On</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
              <div style={{ fontSize: '10px', color: '#059669', fontWeight: 700, marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <ShieldCheck size={13} /> Verified Authentic Record
              </div>
            </div>
          </div>

          {/* Patient Identification Card */}
          <div style={{ backgroundColor: '#F8F6F1', border: '1px solid #E6E1D5', borderRadius: '12px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', fontSize: '13px' }}>
              <div>
                <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Patient Full Name</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginTop: '2px' }}>{patient.name}</div>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Universal Health ID</div>
                <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', color: 'var(--accent-dark)', marginTop: '2px' }}>
                  {patient.healthId}
                </div>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Age / Gender / Blood</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginTop: '2px' }}>
                  {patient.age} yrs • {patient.gender} • <span style={{ color: '#D64545' }}>{patient.bloodGroup}</span>
                </div>
              </div>
              <div>
                <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Primary Hospital</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#111', marginTop: '2px' }}>{patient.primaryHospital}</div>
              </div>
            </div>
          </div>

          {/* Critical Alerts / Allergies */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <AlertTriangle size={16} color="#D64545" />
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#D64545', margin: 0 }}>
                Documented Allergies & Critical Contraindications
              </h4>
            </div>
            {allergies.length === 0 ? (
              <p style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>No known drug or environmental allergies documented.</p>
            ) : (
              <div style={{ border: '1px solid #FCD34D', backgroundColor: '#FFFBEB', borderRadius: '8px', padding: '12px 16px' }}>
                <ul style={{ paddingLeft: '20px', margin: 0, fontSize: '13px' }}>
                  {allergies.map((alg, idx) => (
                    <li key={idx} style={{ marginBottom: '6px', color: '#92400E' }}>
                      <strong>{alg.allergen} ({alg.severity}):</strong> {alg.reaction}. <em>(Source: {alg.source})</em>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Active Medications & Chronic Conditions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Activity size={16} color="#111" />
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111', margin: 0 }}>
                  Active Chronic Conditions
                </h4>
              </div>
              <div style={{ border: '1px solid #E6E1D5', borderRadius: '8px', padding: '12px 16px', minHeight: '80px' }}>
                {(patient.conditions || []).map((cnd, i) => (
                  <div key={i} style={{ fontSize: '13px', marginBottom: '6px' }}>
                    <strong>● {cnd.condition}</strong> — <span style={{ color: '#666' }}>Diagnosed: {cnd.diagnosedDate}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Pill size={16} color="#111" />
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111', margin: 0 }}>
                  Active Medications
                </h4>
              </div>
              <div style={{ border: '1px solid #E6E1D5', borderRadius: '8px', padding: '12px 16px', minHeight: '80px' }}>
                {activeMeds.map((med, i) => (
                  <div key={i} style={{ fontSize: '13px', marginBottom: '6px' }}>
                    <strong>● {med.name} {med.dosage}</strong> — <span style={{ color: '#666' }}>{med.frequency}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Surgeries */}
          {surgeries.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Scissors size={16} color="#111" />
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111', margin: 0 }}>
                  Surgical History
                </h4>
              </div>
              <div style={{ border: '1px solid #E6E1D5', borderRadius: '8px', padding: '12px 16px' }}>
                {surgeries.map((surg, idx) => (
                  <div key={idx} style={{ fontSize: '13px', marginBottom: idx !== surgeries.length - 1 ? '10px' : 0, paddingBottom: idx !== surgeries.length - 1 ? '10px' : 0, borderBottom: idx !== surgeries.length - 1 ? '1px dashed #E0D9CB' : 'none' }}>
                    <div style={{ fontWeight: 700 }}>{surg.procedure || surg.title} ({surg.date})</div>
                    <div style={{ color: '#666', fontSize: '12px' }}>Hospital: {surg.hospital} • Surgeon: {surg.doctor}</div>
                    <div style={{ color: '#444', fontSize: '12px', marginTop: '2px' }}>Outcome: {surg.outcome}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verified Health Timeline Table */}
          <div>
            <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111', marginBottom: '10px' }}>
              Chronological Health Events (Longitudinal Record)
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F4F1EA', borderBottom: '1px solid #D5CEBF' }}>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>Type</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>Clinical Event</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>Hospital & Doctor</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 700 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #EFEBE1' }}>
                    <td style={{ padding: '8px 10px', whiteSpace: 'nowrap', fontWeight: 600 }}>{r.date}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span className="badge badge-neutral" style={{ fontSize: '10px', padding: '2px 6px' }}>
                        {r.type}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px', fontWeight: 600 }}>{r.title}</td>
                    <td style={{ padding: '8px 10px', color: '#555' }}>{r.hospital} ({r.doctor})</td>
                    <td style={{ padding: '8px 10px', color: '#2E7D32', fontWeight: 600 }}>✓ Verified</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legal Notice / Stamp */}
          <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px solid #DDD', fontSize: '11px', color: '#777', display: 'flex', justifyContent: 'space-between' }}>
            <span>HealthStory Platform — Confidential Patient Record Summary</span>
            <span>Ref: {patient.healthId} • Official Hospital Copy</span>
          </div>
        </div>
      </div>
    </div>
  );
}
