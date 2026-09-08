import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  PlusCircle,
  FileText,
  Printer,
  Sparkles,
  Search,
  ChevronDown,
  ChevronUp,
  Pill,
  Clock,
  CheckCircle2,
  Upload,
  Eye,
  ArrowLeft
} from 'lucide-react';
import { StorageService } from '../../data/mockDatabase';
import HealthIdCard from '../shared/HealthIdCard';

export default function AdminPatientProfile({
  patient,
  records = [],
  documents = [],
  auditLogs = [],
  currentStaff,
  onBack,
  onOpenAddRecord,
  onOpenExportSummary,
  onViewDocument,
  onUploadDocument,
  onAddAllergy,
  onAddMedication
}) {
  const [activeTab, setActiveTab] = useState('timeline'); // 'timeline', 'ai_summary', 'allergies', 'medications', 'documents', 'audit', 'id_card'
  const [timelineFilter, setTimelineFilter] = useState('ALL');
  const [expandedRecordIds, setExpandedRecordIds] = useState(new Set([records[0]?.id]));
  const [searchTimelineQuery, setSearchTimelineQuery] = useState('');

  // AI Summary State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);

  // New Allergy Inline Form State
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [newAllergen, setNewAllergen] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState('Critical');
  const [newAllergyReaction, setNewAllergyReaction] = useState('');

  // New Medication Inline Form State
  const [showMedForm, setShowMedForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('Once daily');
  const [newMedReason, setNewMedReason] = useState('');

  // New Document Upload State
  const [showDocUpload, setShowDocUpload] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState('Lab Reports');
  const [docSummary, setDocSummary] = useState('');

  if (!patient) return null;

  const toggleExpand = (id) => {
    const next = new Set(expandedRecordIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRecordIds(next);
  };

  const handleGenerateAi = () => {
    setAiLoading(true);
    setTimeout(() => {
      const summary = StorageService.generateAiSummary(patient.id);
      setAiSummary(summary);
      setAiLoading(false);
    }, 900);
  };

  const handleCreateAllergy = (e) => {
    e.preventDefault();
    if (!newAllergen.trim()) return;
    onAddAllergy(patient.id, {
      allergen: newAllergen.trim(),
      severity: newAllergySeverity,
      reaction: newAllergyReaction.trim() || 'Documented clinical reaction'
    });
    setNewAllergen('');
    setNewAllergyReaction('');
    setShowAllergyForm(false);
  };

  const handleCreateMed = (e) => {
    e.preventDefault();
    if (!newMedName.trim()) return;
    onAddMedication(patient.id, {
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      frequency: newMedFreq.trim(),
      reason: newMedReason.trim() || 'Clinical indication'
    });
    setNewMedName('');
    setNewMedDosage('');
    setShowMedForm(false);
  };

  const handleCreateDoc = (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    onUploadDocument({
      patientId: patient.id,
      healthId: patient.healthId,
      patientName: patient.name,
      title: docTitle.trim(),
      category: docCategory,
      reportSummary: docSummary.trim() || 'Verified clinical document attached to patient health story.',
      date: new Date().toISOString().split('T')[0]
    });
    setDocTitle('');
    setDocSummary('');
    setShowDocUpload(false);
  };

  // Group records by year
  const filteredRecords = records.filter(r => {
    const matchesType = timelineFilter === 'ALL' || r.type === timelineFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchTimelineQuery.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTimelineQuery.toLowerCase())) ||
      (r.doctor && r.doctor.toLowerCase().includes(searchTimelineQuery.toLowerCase())) ||
      (r.hospital && r.hospital.toLowerCase().includes(searchTimelineQuery.toLowerCase())) ||
      (r.diagnosis && r.diagnosis.toLowerCase().includes(searchTimelineQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const recordsByYear = filteredRecords.reduce((acc, r) => {
    const y = r.year || new Date(r.date).getFullYear();
    if (!acc[y]) acc[y] = [];
    acc[y].push(r);
    return acc;
  }, {});

  const sortedYears = Object.keys(recordsByYear).sort((a, b) => Number(b) - Number(a));

  const hasCriticalAllergies = (patient.allergies || []).some(a => a.severity === 'Critical');

  return (
    <div style={{ padding: '32px 24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Back to Directory Button */}
      <button
        onClick={onBack}
        className="btn btn-sm btn-ghost"
        style={{ marginBottom: '16px', color: '#555' }}
      >
        <ArrowLeft size={16} /> Back to Patients Directory
      </button>

      {/* Patient Profile Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span className="badge badge-accent">LONGITUDINAL PATIENT PROFILE</span>
              <span style={{ fontSize: '12px', color: '#777' }}>
                Primary Hospital: <strong>{patient.primaryHospital}</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.03em' }}>
                {patient.name}
              </h1>
              <span
                style={{
                  fontFamily: 'monospace',
                  fontSize: '18px',
                  fontWeight: 800,
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent-dark)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(229,154,50,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={18} color="var(--accent-primary)" />
                {patient.healthId}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', fontSize: '13.5px', color: '#555', flexWrap: 'wrap' }}>
              <span><strong>{patient.age}</strong> years • {patient.gender}</span>
              <span>•</span>
              <span>DOB: <strong>{patient.dateOfBirth}</strong></span>
              <span>•</span>
              <span>Blood Group: <strong style={{ color: '#D64545' }}>{patient.bloodGroup}</strong></span>
              <span>•</span>
              <span>Phone: {patient.phone}</span>
              <span>•</span>
              <span>Last Updated: <strong>{new Date(patient.lastUpdated || patient.registeredAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={onOpenAddRecord} className="btn btn-primary">
              <PlusCircle size={16} /> + Add Health Record
            </button>
            <button onClick={onOpenExportSummary} className="btn btn-outline">
              <Printer size={15} /> Export Summary
            </button>
          </div>
        </div>

        {/* Critical Information Summary Banner */}
        <div
          style={{
            marginTop: '24px',
            padding: '18px 22px',
            borderRadius: '16px',
            backgroundColor: hasCriticalAllergies ? '#FEF2F2' : 'var(--bg-canvas)',
            border: hasCriticalAllergies ? '1px solid #FECACA' : '1px solid var(--border-subtle)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}
        >
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              BLOOD GROUP
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#D64545', marginTop: '2px' }}>
              {patient.bloodGroup}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: hasCriticalAllergies ? '#B91C1C' : '#777', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
              {hasCriticalAllergies && <AlertTriangle size={13} color="#DC2626" />}
              ALLERGIES
            </div>
            <div style={{ fontSize: '15px', fontWeight: 800, color: hasCriticalAllergies ? '#DC2626' : '#111', marginTop: '4px' }}>
              {(patient.allergies || []).length > 0
                ? patient.allergies.map(a => a.allergen).join(', ')
                : 'None documented'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              ACTIVE CONDITIONS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginTop: '4px' }}>
              {(patient.conditions || []).length} documented
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              CURRENT MEDICATIONS
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginTop: '4px' }}>
              {(patient.medications || []).filter(m => m.status === 'Active').length} active
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              PREVIOUS SURGERIES
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginTop: '4px' }}>
              {records.filter(r => r.type === 'SURGERY').length} recorded
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '12px',
          marginBottom: '28px',
          overflowX: 'auto'
        }}
      >
        <button
          onClick={() => setActiveTab('timeline')}
          className={`btn btn-sm ${activeTab === 'timeline' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <Clock size={14} /> Complete Health Story ({records.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('ai_summary');
            if (!aiSummary && !aiLoading) handleGenerateAi();
          }}
          className={`btn btn-sm ${activeTab === 'ai_summary' ? 'btn-dark' : 'btn-ghost'}`}
          style={{ color: activeTab === 'ai_summary' ? '#FFF' : 'var(--accent-dark)' }}
        >
          <Sparkles size={14} color="var(--accent-primary)" /> ✦ HealthStory AI Summary
        </button>

        <button
          onClick={() => setActiveTab('allergies')}
          className={`btn btn-sm ${activeTab === 'allergies' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <AlertTriangle size={14} color={hasCriticalAllergies ? '#DC2626' : '#777'} /> Critical Allergies ({ (patient.allergies || []).length })
        </button>

        <button
          onClick={() => setActiveTab('medications')}
          className={`btn btn-sm ${activeTab === 'medications' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <Pill size={14} /> Medications ({ (patient.medications || []).length })
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`btn btn-sm ${activeTab === 'documents' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <FileText size={14} /> Documents Vault ({documents.length})
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`btn btn-sm ${activeTab === 'audit' ? 'btn-dark' : 'btn-ghost'}`}
        >
          <ShieldCheck size={14} /> Audit Trail ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('id_card')}
          className={`btn btn-sm ${activeTab === 'id_card' ? 'btn-dark' : 'btn-ghost'}`}
        >
          Digital Health ID Card
        </button>
      </div>

      {/* TAB 1: COMPLETE HEALTH STORY TIMELINE */}
      {activeTab === 'timeline' && (
        <div>
          {/* Timeline Filter & Search Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid var(--border-subtle)',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {['ALL', 'CHECKUP', 'SURGERY', 'DIAGNOSIS', 'LAB_REPORT', 'IMAGING', 'HOSPITALIZATION', 'VACCINATION'].map(t => (
                <button
                  key={t}
                  onClick={() => setTimelineFilter(t)}
                  className={`btn btn-sm ${timelineFilter === t ? 'btn-dark' : 'btn-outline'}`}
                  style={{ fontSize: '11.5px', padding: '5px 12px' }}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={15} color="#888" style={{ position: 'absolute', left: '12px', top: '10px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search within timeline..."
                value={searchTimelineQuery}
                onChange={e => setSearchTimelineQuery(e.target.value)}
                style={{ paddingLeft: '34px', padding: '6px 12px 6px 34px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Timeline Feed Grouped by Year */}
          {sortedYears.length === 0 ? (
            <div style={{ padding: '60px 24px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <Clock size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
                {records.length === 0 ? "No clinical records added yet" : "No clinical events found matching your filter"}
              </h3>
              <p style={{ fontSize: '13.5px', color: '#666', maxWidth: '440px', margin: '0 auto 16px' }}>
                {records.length === 0 ? "Hospital staff can add verified checkups, surgeries, prescriptions, and lab tests to build the patient's continuous health story." : "Try clearing search keywords or choosing 'ALL' record types."}
              </p>
              {records.length === 0 && (
                <button onClick={onOpenAddRecord} className="btn btn-primary btn-sm">
                  <PlusCircle size={14} /> + Add First Health Record
                </button>
              )}
            </div>
          ) : (
            sortedYears.map(year => (
              <div key={year} style={{ marginBottom: '40px' }}>
                {/* Year Header Banner */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '28px',
                      fontWeight: 900,
                      color: 'var(--accent-primary)',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {year}
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-medium)' }} />
                  <span style={{ fontSize: '12px', color: '#777', fontWeight: 600 }}>
                    {recordsByYear[year].length} event{recordsByYear[year].length > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Timeline Track with Connecting Line */}
                <div className="timeline-track">
                  {recordsByYear[year].map(record => {
                    const isExpanded = expandedRecordIds.has(record.id);
                    const isSurgery = record.type === 'SURGERY';
                    const isLab = record.type === 'LAB_REPORT' || record.type === 'IMAGING';
                    const isVaccine = record.type === 'VACCINATION';

                    return (
                      <div
                        key={record.id}
                        style={{
                          position: 'relative',
                          marginBottom: '20px'
                        }}
                      >
                        {/* Timeline Node Dot */}
                        <div
                          className={`timeline-dot ${isSurgery ? 'surgery' : isLab ? 'lab' : isVaccine ? 'vaccine' : 'checkup'}`}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: isSurgery ? '#DC2626' : isLab ? '#3B82F6' : isVaccine ? '#16A34A' : 'var(--accent-primary)'
                            }}
                          />
                        </div>

                        {/* Event Card */}
                        <div
                          className="card"
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: isSurgery ? '1px solid #FECACA' : '1px solid var(--border-subtle)',
                            padding: '20px 24px',
                            cursor: 'pointer'
                          }}
                          onClick={() => toggleExpand(record.id)}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <span
                                  className={`badge ${isSurgery ? 'badge-critical' : isLab ? 'badge-neutral' : 'badge-accent'}`}
                                  style={{ fontSize: '10.5px' }}
                                >
                                  {record.type.replace('_', ' ')}
                                </span>
                                <span style={{ fontSize: '12.5px', color: '#666', fontWeight: 600 }}>
                                  {new Date(record.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span style={{ color: '#DDD' }}>•</span>
                                <span style={{ fontSize: '12.5px', color: '#777' }}>{record.hospital}</span>
                              </div>

                              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                                {record.title}
                              </h3>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={14} /> Verified
                              </span>
                              <button
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#777',
                                  cursor: 'pointer',
                                  padding: '4px'
                                }}
                              >
                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                              </button>
                            </div>
                          </div>

                          {/* Preview Description */}
                          {!isExpanded && record.description && (
                            <p style={{ fontSize: '13px', color: '#555', marginTop: '8px', lineHeight: 1.5 }}>
                              {record.description}
                            </p>
                          )}

                          {/* Expanded Full Details */}
                          {isExpanded && (
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', animation: 'fadeIn 0.25s ease' }}>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px', backgroundColor: 'var(--bg-canvas)', padding: '14px', borderRadius: '10px' }}>
                                <div>
                                  <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>Attending Physician</div>
                                  <div style={{ fontWeight: 700, color: '#111', fontSize: '13px', marginTop: '2px' }}>{record.doctor} ({record.staffId})</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>Department</div>
                                  <div style={{ fontWeight: 700, color: '#111', fontSize: '13px', marginTop: '2px' }}>{record.department || 'General'}</div>
                                </div>
                                <div>
                                  <div style={{ fontSize: '11px', color: '#777', textTransform: 'uppercase' }}>Encounter Date</div>
                                  <div style={{ fontWeight: 700, color: '#111', fontSize: '13px', marginTop: '2px' }}>{record.date}</div>
                                </div>
                              </div>

                              {record.vitals && (
                                <div style={{ marginBottom: '16px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555', marginBottom: '6px' }}>
                                    Recorded Vitals
                                  </div>
                                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '13px' }}>
                                    {record.vitals.bloodPressure && (
                                      <span className="badge badge-neutral">BP: {record.vitals.bloodPressure}</span>
                                    )}
                                    {record.vitals.heartRate && (
                                      <span className="badge badge-neutral">HR: {record.vitals.heartRate}</span>
                                    )}
                                    {record.vitals.oxygenSaturation && (
                                      <span className="badge badge-neutral">SpO2: {record.vitals.oxygenSaturation}</span>
                                    )}
                                    {record.vitals.temperature && (
                                      <span className="badge badge-neutral">Temp: {record.vitals.temperature}</span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {record.diagnosis && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>Diagnosis & Impression</div>
                                  <div style={{ fontSize: '13.5px', color: '#222', marginTop: '2px' }}>{record.diagnosis}</div>
                                </div>
                              )}

                              {record.notes && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>Clinical Notes</div>
                                  <div style={{ fontSize: '13.5px', color: '#333', lineHeight: 1.55, marginTop: '2px' }}>{record.notes}</div>
                                </div>
                              )}

                              {record.outcome && (
                                <div style={{ marginBottom: '12px' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#555' }}>Clinical Outcome</div>
                                  <div style={{ fontSize: '13px', color: '#059669', fontWeight: 600, marginTop: '2px' }}>{record.outcome}</div>
                                </div>
                              )}

                              {/* Attached Reports Link */}
                              {record.documentIds && record.documentIds.length > 0 && (
                                <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px dashed #DDD' }}>
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

      {/* TAB 2: AI HEALTH SUMMARY */}
      {activeTab === 'ai_summary' && (
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--border-medium)', padding: '36px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#111' }}>✦ HealthStory AI Summary</h3>
                  <div style={{ fontSize: '12px', color: '#777' }}>Synthesized solely from verified longitudinal records on file</div>
                </div>
              </div>

              <button onClick={handleGenerateAi} className="btn btn-sm btn-outline" disabled={aiLoading}>
                <Sparkles size={14} /> Refresh Summary
              </button>
            </div>

            {aiLoading ? (
              <div style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '15px', color: 'var(--accent-dark)', fontWeight: 600 }}>
                  <Sparkles className="animate-spin" size={18} /> Reviewing {records.length} longitudinal records...
                </div>
              </div>
            ) : aiSummary ? (
              <div>
                <div style={{ padding: '14px 18px', backgroundColor: 'var(--accent-light)', borderRadius: '10px', border: '1px solid rgba(229,154,50,0.3)', fontSize: '12px', color: 'var(--accent-dark)', marginBottom: '24px' }}>
                  <strong>Organizational Safety Notice:</strong> {aiSummary.disclaimer}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {aiSummary.bulletPoints.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '16px',
                        backgroundColor: item.isCritical ? '#FEF2F2' : 'var(--bg-canvas)',
                        borderRadius: '12px',
                        border: item.isCritical ? '1px solid #FECACA' : '1px solid var(--border-subtle)'
                      }}
                    >
                      <div style={{ fontSize: '14.5px', color: item.isCritical ? '#991B1B' : '#111', fontWeight: 600, lineHeight: 1.5 }}>
                        {item.text}
                      </div>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: '#777' }}>
                        <span>Supporting Citation:</span>
                        <span className="badge badge-neutral" style={{ fontSize: '10.5px' }}>
                          {item.citation}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <button onClick={handleGenerateAi} className="btn btn-primary">
                  <Sparkles size={16} /> Generate Verified Summary
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: ALLERGIES MANAGEMENT */}
      {activeTab === 'allergies' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Documented Allergies & Sensitivities</h3>
            <button onClick={() => setShowAllergyForm(!showAllergyForm)} className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> + Document Allergy
            </button>
          </div>

          {showAllergyForm && (
            <form onSubmit={handleCreateAllergy} style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', border: '1px solid var(--accent-primary)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-dark)' }}>
                Document New Clinical Allergy
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 2fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Allergen name (e.g. Sulfa, Latex)"
                  className="form-input"
                  value={newAllergen}
                  onChange={e => setNewAllergen(e.target.value)}
                  required
                />
                <select className="form-select" value={newAllergySeverity} onChange={e => setNewAllergySeverity(e.target.value)}>
                  <option value="Critical">Critical (Anaphylaxis)</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Mild">Mild</option>
                </select>
                <input
                  type="text"
                  placeholder="Adverse reaction details"
                  className="form-input"
                  value={newAllergyReaction}
                  onChange={e => setNewAllergyReaction(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAllergyForm(false)} className="btn btn-sm btn-outline">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary">Save to Allergy Registry</button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {(patient.allergies || []).length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '12px' }}>
                No allergies documented.
              </div>
            ) : (
              patient.allergies.map(alg => (
                <div
                  key={alg.id}
                  className="card"
                  style={{
                    backgroundColor: alg.severity === 'Critical' ? '#FEF2F2' : '#FFFFFF',
                    border: alg.severity === 'Critical' ? '1px solid #FECACA' : '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '17px', fontWeight: 800, color: alg.severity === 'Critical' ? '#991B1B' : '#111' }}>
                      ⚠ {alg.allergen}
                    </h4>
                    <span className={`badge ${alg.severity === 'Critical' ? 'badge-critical' : 'badge-neutral'}`}>
                      {alg.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#444', marginBottom: '8px' }}>
                    <strong>Reaction:</strong> {alg.reaction}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#777', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '10px' }}>
                    Documented: {alg.documentedDate} • Source: {alg.source}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MEDICATIONS MANAGEMENT */}
      {activeTab === 'medications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Prescriptions & Medication History</h3>
            <button onClick={() => setShowMedForm(!showMedForm)} className="btn btn-primary btn-sm">
              <PlusCircle size={14} /> + Add Medication
            </button>
          </div>

          {showMedForm && (
            <form onSubmit={handleCreateMed} style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', border: '1px solid var(--accent-primary)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-dark)' }}>
                Prescribe New Medication
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1.5fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Drug Name (e.g. Omeprazole)"
                  className="form-input"
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  required
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g. 20 mg)"
                  className="form-input"
                  value={newMedDosage}
                  onChange={e => setNewMedDosage(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g. Once daily)"
                  className="form-input"
                  value={newMedFreq}
                  onChange={e => setNewMedFreq(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Clinical indication"
                  className="form-input"
                  value={newMedReason}
                  onChange={e => setNewMedReason(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowMedForm(false)} className="btn btn-sm btn-outline">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary">Save Prescription</button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(patient.medications || []).map(med => (
              <div
                key={med.id}
                className="card"
                style={{
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 20px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong style={{ fontSize: '16px', color: '#111' }}>{med.name} {med.dosage}</strong>
                    <span className={`badge ${med.status === 'Active' ? 'badge-success' : 'badge-neutral'}`} style={{ fontSize: '10px' }}>
                      {med.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#555', marginTop: '4px' }}>
                    {med.frequency} • Indication: {med.reason}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: '12px', color: '#777' }}>
                  <div>Started: {med.startDate}</div>
                  <div>Prescribed by: {med.prescribedBy}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: MEDICAL DOCUMENTS VAULT */}
      {activeTab === 'documents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800 }}>Medical Documents & Imaging Reports</h3>
            <button onClick={() => setShowDocUpload(!showDocUpload)} className="btn btn-primary btn-sm">
              <Upload size={14} /> + Upload Clinical Document
            </button>
          </div>

          {showDocUpload && (
            <form onSubmit={handleCreateDoc} style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', border: '1px solid var(--accent-primary)', marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: 'var(--accent-dark)' }}>
                Upload & Verify Clinical Document
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Document Title (e.g. Brain MRI Report.pdf)"
                  className="form-input"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  required
                />
                <select className="form-select" value={docCategory} onChange={e => setDocCategory(e.target.value)}>
                  <option value="Lab Reports">Lab Reports</option>
                  <option value="Imaging">Imaging</option>
                  <option value="Discharge Summaries">Discharge Summaries</option>
                  <option value="Prescriptions">Prescriptions</option>
                  <option value="Consultation Notes">Consultation Notes</option>
                </select>
              </div>
              <textarea
                placeholder="Clinical Diagnostic Findings Summary"
                className="form-textarea"
                value={docSummary}
                onChange={e => setDocSummary(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowDocUpload(false)} className="btn btn-sm btn-outline">Cancel</button>
                <button type="submit" className="btn btn-sm btn-primary">Upload & Verify</button>
              </div>
            </form>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {documents.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '12px' }}>
                No documents uploaded.
              </div>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="card card-hover" style={{ backgroundColor: '#FFFFFF', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
                      <FileText size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>{doc.title}</h4>
                      <div style={{ fontSize: '11.5px', color: '#777', marginTop: '2px' }}>
                        {doc.category} • {doc.fileSize} • {doc.date}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12.5px', color: '#555', marginBottom: '16px', lineHeight: 1.45 }}>
                    {doc.reportSummary}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>✓ Verified Hospital File</span>
                    <button onClick={() => onViewDocument(doc)} className="btn btn-sm btn-dark">
                      <Eye size={13} /> View File
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div className="card" style={{ backgroundColor: '#FFFFFF', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Immutable Patient Record Audit Trail</h3>
                <p style={{ fontSize: '12.5px', color: '#666' }}>
                  Cryptographic log of all modifications, additions, and access events for Health ID <code>{patient.healthId}</code>.
                </p>
              </div>
              <span className="badge badge-success">Tamper-Evident</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {auditLogs.map((log, i) => (
                <div
                  key={i}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '14px', color: '#111' }}>{log.action}</strong>
                    <span style={{ fontSize: '12px', color: '#777' }}>
                      {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#444', marginBottom: '6px' }}>
                    {log.details}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#777', display: 'flex', gap: '14px' }}>
                    <span>Authorizing Staff: <strong>{log.staffName || log.staffId}</strong></span>
                    <span>Facility: <strong>{log.hospital}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: DIGITAL HEALTH ID CARD */}
      {activeTab === 'id_card' && (
        <div style={{ maxWidth: '580px', margin: '0 auto' }}>
          <HealthIdCard patient={patient} onPrint={() => window.print()} />
        </div>
      )}
    </div>
  );
}
