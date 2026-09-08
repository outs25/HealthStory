import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  FileText,
  Eye,
  Lock,
  Printer,
  Clock
} from 'lucide-react';
import HealthIdCard from '../shared/HealthIdCard';

export default function PatientDashboard({
  patient,
  records = [],
  documents = [],
  auditLogs = [],
  onViewDocument,
  onOpenExportSummary
}) {
  const [expandedRecordIds, setExpandedRecordIds] = useState(new Set([records[0]?.id]));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('journey'); // 'journey', 'documents', 'history', 'id_card'

  if (!patient) return null;

  const toggleExpand = (id) => {
    const next = new Set(expandedRecordIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRecordIds(next);
  };

  const filteredRecords = records.filter(r => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      (r.type && r.type.toLowerCase().includes(q)) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.doctor && r.doctor.toLowerCase().includes(q)) ||
      (r.hospital && r.hospital.toLowerCase().includes(q)) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(q))
    );
  });

  const recordsByYear = filteredRecords.reduce((acc, r) => {
    const y = r.year || new Date(r.date).getFullYear();
    if (!acc[y]) acc[y] = [];
    acc[y].push(r);
    return acc;
  }, {});

  const sortedYears = Object.keys(recordsByYear).sort((a, b) => Number(b) - Number(a));

  const criticalAllergies = (patient.allergies || []).filter(a => a.severity === 'Critical');
  const activeMedications = (patient.medications || []).filter(m => m.status === 'Active');

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Patient Hero Welcome */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '24px',
          marginBottom: '36px'
        }}
      >
        <div>
          <span className="badge badge-success" style={{ marginBottom: '8px' }}>
            <Lock size={12} /> VERIFIED PATIENT PORTAL • READ-ONLY
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              color: '#111'
            }}
          >
            Your Health Story
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '580px', marginTop: '6px' }}>
            Everything you've ever needed to know about your health, in one verified place.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onOpenExportSummary} className="btn btn-dark">
            <Printer size={15} /> Download / Print Health Summary
          </button>
        </div>
      </div>

      {/* Top Section: Health At A Glance Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '32px'
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
            BLOOD GROUP
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#D64545', marginTop: '4px' }}>
            {patient.bloodGroup}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            Verified hospital baseline
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
            KNOWN ALLERGIES
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: criticalAllergies.length > 0 ? '#DC2626' : '#111', marginTop: '4px' }}>
            {(patient.allergies || []).length}
          </div>
          <div style={{ fontSize: '12px', color: criticalAllergies.length > 0 ? '#DC2626' : '#666', marginTop: '2px' }}>
            {criticalAllergies.length > 0 ? '⚠ High-risk allergy flagged' : 'Documented on record'}
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
            ACTIVE MEDICATIONS
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#2563EB', marginTop: '4px' }}>
            {activeMedications.length}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            Currently prescribed regimens
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '22px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
            MEDICAL EVENTS
          </div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
            {records.length}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
            ● Continuous verified history
          </div>
        </div>
      </div>

      {/* Critical Information Banner (Strict Read-Only) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '24px 28px',
          marginBottom: '36px',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#111' }}>
            Important Health Information
          </h3>
          <span style={{ fontSize: '12px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#059669" /> Information is maintained by authorized healthcare staff.
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', fontSize: '13.5px' }}>
          <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Blood Group</div>
            <strong style={{ fontSize: '16px', color: '#D64545' }}>{patient.bloodGroup}</strong>
          </div>

          <div style={{ backgroundColor: criticalAllergies.length > 0 ? '#FEF2F2' : 'var(--bg-canvas)', padding: '14px', borderRadius: '12px', border: criticalAllergies.length > 0 ? '1px solid #FECACA' : 'none' }}>
            <div style={{ color: criticalAllergies.length > 0 ? '#DC2626' : '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>
              Known Allergies
            </div>
            <strong style={{ fontSize: '14px', color: criticalAllergies.length > 0 ? '#DC2626' : '#111' }}>
              {(patient.allergies || []).map(a => `${a.allergen} (${a.severity})`).join(', ') || 'None documented'}
            </strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Current Conditions</div>
            <strong style={{ fontSize: '14px', color: '#111' }}>
              {(patient.conditions || []).map(c => c.condition).join(', ') || 'None'}
            </strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Current Medications</div>
            <strong style={{ fontSize: '14px', color: '#111' }}>
              {activeMedications.map(m => m.name).join(', ') || 'None'}
            </strong>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '28px' }}>
        <button
          onClick={() => setActiveTab('journey')}
          className={`btn btn-sm ${activeTab === 'journey' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <Heart size={14} color="var(--accent-primary)" /> Your Health Journey ({records.length})
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`btn btn-sm ${activeTab === 'documents' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <FileText size={14} /> Verified Documents ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`btn btn-sm ${activeTab === 'history' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <Clock size={14} /> Record Verification Log
        </button>

        <button
          onClick={() => setActiveTab('id_card')}
          className={`btn btn-sm ${activeTab === 'id_card' ? 'btn-dark' : 'btn-ghost'}`}
        >
          Your Health ID Card
        </button>
      </div>

      {/* 1. HEALTH JOURNEY TIMELINE */}
      {activeTab === 'journey' && (
        <div>
          {/* Patient In-History Search Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '16px 20px',
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <Search size={18} color="#888" />
            <input
              type="text"
              className="form-input"
              placeholder="Search in your health history (e.g. 'surgery', 'blood tests', 'penicillin', 'asthma')..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ border: 'none', padding: '6px 0', backgroundColor: 'transparent' }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="btn btn-sm btn-ghost" style={{ padding: '4px 8px' }}>
                Clear
              </button>
            )}
          </div>

          {/* Chronological Timeline */}
          {sortedYears.length === 0 ? (
            <div
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
                No health records have been added yet.
              </h3>
              <p style={{ fontSize: '14.5px', color: '#666', maxWidth: '460px', margin: '0 auto' }}>
                Your health story starts here. Verified checkups, prescriptions, and reports will appear in your timeline as they are recorded by authorized hospital staff.
              </p>
            </div>
          ) : (
            sortedYears.map(year => (
              <div key={year} style={{ marginBottom: '44px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '32px',
                      fontWeight: 900,
                      color: 'var(--accent-primary)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {year}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-medium)' }} />
                </div>

                <div className="timeline-track">
                  {recordsByYear[year].map(record => {
                    const isExpanded = expandedRecordIds.has(record.id);
                    const isSurgery = record.type === 'SURGERY';

                    return (
                      <div key={record.id} style={{ position: 'relative', marginBottom: '20px' }}>
                        {/* Dot */}
                        <div className={`timeline-dot ${isSurgery ? 'surgery' : 'checkup'}`}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isSurgery ? '#DC2626' : 'var(--accent-primary)' }} />
                        </div>

                        {/* Card */}
                        <div
                          className="card"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: isSurgery ? '1px solid #FECACA' : '1px solid var(--border-subtle)',
                            padding: '22px 26px',
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleExpand(record.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span className={`badge ${isSurgery ? 'badge-critical' : 'badge-accent'}`} style={{ fontSize: '10px' }}>
                                  {record.type.replace('_', ' ')}
                                </span>
                                <span style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>
                                  {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                                <span style={{ color: '#DDD' }}>•</span>
                                <span style={{ fontSize: '13px', color: '#777' }}>{record.hospital}</span>
                              </div>

                              <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#111' }}>
                                {record.title}
                              </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span className="badge badge-success" style={{ fontSize: '11px', textTransform: 'none', padding: '3px 9px' }}>
                                ✓ Verified Hospital Record
                              </span>
                              <button style={{ background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}>
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          {!isExpanded && record.description && (
                            <p style={{ fontSize: '13.5px', color: '#555', marginTop: '10px', lineHeight: 1.55 }}>
                              {record.description}
                            </p>
                          )}

                          {isExpanded && (
                            <div style={{ marginTop: '18px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', animation: 'fadeIn 0.25s ease' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
                                <div>
                                  <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase' }}>Recorded by</div>
                                  <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{record.doctor}</div>
                                </div>
                                <div>
                                  <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase' }}>Facility</div>
                                  <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{record.hospital}</div>
                                </div>
                                <div>
                                  <div style={{ color: '#777', fontSize: '11px', textTransform: 'uppercase' }}>Department</div>
                                  <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{record.department || 'General'}</div>
                                </div>
                              </div>

                              {record.diagnosis && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Diagnosis & Impression</div>
                                  <div style={{ fontSize: '14px', color: '#222', marginTop: '2px' }}>{record.diagnosis}</div>
                                </div>
                              )}

                              {record.notes && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Doctor Notes</div>
                                  <div style={{ fontSize: '14px', color: '#333', lineHeight: 1.55, marginTop: '2px' }}>{record.notes}</div>
                                </div>
                              )}

                              {record.outcome && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#555', textTransform: 'uppercase' }}>Outcome</div>
                                  <div style={{ fontSize: '13.5px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>{record.outcome}</div>
                                </div>
                              )}

                              {record.documentIds && record.documentIds.length > 0 && (
                                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed #DDD' }}>
                                  <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase', marginBottom: '6px' }}>Attached Medical Reports</div>
                                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {record.documentIds.map(docId => {
                                      const doc = documents.find(d => d.id === docId);
                                      if (!doc) return null;
                                      return (
                                        <button
                                          key={docId}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDocument(doc);
                                          }}
                                          className="btn btn-sm btn-outline"
                                          style={{ fontSize: '12px', padding: '4px 10px' }}
                                        >
                                          <FileText size={13} /> {doc.title}
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. VERIFIED DOCUMENTS VAULT */}
      {activeTab === 'documents' && (
        <div>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Verified Medical Documents</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Official lab reports, diagnostic imaging findings, and hospital discharge summaries uploaded and verified by your care team.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {documents.map(doc => (
              <div key={doc.id} className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>{doc.title}</h4>
                    <div style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>
                      {doc.category} • {doc.fileSize} • {doc.date}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '13px', color: '#555', marginBottom: '18px', lineHeight: 1.5 }}>
                  {doc.reportSummary}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>✓ Verified Hospital File</span>
                  <button onClick={() => onViewDocument(doc)} className="btn btn-sm btn-dark">
                    <Eye size={14} /> View Document
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. RECORD VERIFICATION LOG */}
      {activeTab === 'history' && (
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '32px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Record Verification Transparency</h3>
              <p style={{ fontSize: '13px', color: '#666' }}>
                Every update to your health story is authorized and stamped by hospital staff. Here is the record of when your medical profile was updated.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {auditLogs.map((log, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ color: '#111', fontSize: '14px' }}>{log.action}</strong>
                    <span style={{ fontSize: '12px', color: '#777' }}>
                      {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <div style={{ color: '#444' }}>{log.details}</div>
                  <div style={{ fontSize: '11.5px', color: '#777', marginTop: '6px' }}>
                    Authorized by: <strong>{log.staffName || log.staffId}</strong> at {log.hospital}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. DIGITAL HEALTH ID CARD */}
      {activeTab === 'id_card' && (
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Your Official HealthStory Card</h3>
            <p style={{ fontSize: '13px', color: '#666' }}>
              Present this Universal Health ID card whenever visiting participating hospitals or clinics.
            </p>
          </div>
          <HealthIdCard patient={patient} onPrint={() => window.print()} />
        </div>
      )}
    </div>
  );
}
