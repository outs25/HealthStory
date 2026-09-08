import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Stethoscope,
  Scissors,
  Activity,
  AlertTriangle,
  Pill,
  FileText,
  Camera,
  Building,
  Syringe,
  CheckCircle2
} from 'lucide-react';

const RECORD_TYPES = [
  { type: 'CHECKUP', label: 'Checkup', icon: Stethoscope, color: 'var(--accent-primary)' },
  { type: 'SURGERY', label: 'Surgery', icon: Scissors, color: '#DC2626' },
  { type: 'DIAGNOSIS', label: 'Diagnosis', icon: Activity, color: '#2563EB' },
  { type: 'LAB_REPORT', label: 'Lab Report', icon: FileText, color: '#059669' },
  { type: 'IMAGING', label: 'Imaging / MRI', icon: Camera, color: '#7C3AED' },
  { type: 'ALLERGY', label: 'Allergy', icon: AlertTriangle, color: '#D97706' },
  { type: 'MEDICATION', label: 'Medication', icon: Pill, color: '#0284C7' },
  { type: 'HOSPITALIZATION', label: 'Hospitalization', icon: Building, color: '#4B5563' },
  { type: 'VACCINATION', label: 'Vaccination', icon: Syringe, color: '#16A34A' }
];

export default function AddRecordModal({
  isOpen,
  patient,
  currentStaff,
  onClose,
  onSaveRecord
}) {
  const [selectedType, setSelectedType] = useState('CHECKUP');
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    department: 'Internal Medicine',
    description: '',
    diagnosis: '',
    procedure: '',
    outcome: 'Completed successfully and recorded.',
    notes: '',
    // Vitals
    bp: '120/80',
    hr: '72',
    temp: '98.6',
    spo2: '99',
    // Medication / Allergy specifics
    allergen: '',
    allergySeverity: 'Critical',
    reaction: '',
    medName: '',
    medDosage: '',
    medFreq: 'Once daily',
    // Document
    docTitle: ''
  });

  if (!isOpen || !patient) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let title = formData.title;
    if (!title) {
      if (selectedType === 'SURGERY') title = formData.procedure || 'Surgical Procedure';
      else if (selectedType === 'CHECKUP') title = 'Clinical Health Examination & Vitals';
      else if (selectedType === 'DIAGNOSIS') title = `Clinical Assessment: ${formData.diagnosis || 'General'}`;
      else if (selectedType === 'ALLERGY') title = `Documented Allergy: ${formData.allergen || 'Allergen'}`;
      else if (selectedType === 'LAB_REPORT') title = formData.docTitle || 'Diagnostic Laboratory Report';
      else title = `${selectedType} Record`;
    }

    const vitals = selectedType === 'CHECKUP' ? {
      bloodPressure: `${formData.bp} mmHg`,
      heartRate: `${formData.hr} bpm`,
      temperature: `${formData.temp} °F`,
      oxygenSaturation: `${formData.spo2}%`
    } : null;

    const recordPayload = {
      patientId: patient.id,
      healthId: patient.healthId,
      type: selectedType,
      date: formData.date,
      title,
      hospital: currentStaff?.hospital || patient.primaryHospital,
      doctor: currentStaff?.name || 'Authorized Physician',
      staffId: currentStaff?.staffId || 'HSP-482',
      department: formData.department,
      description: formData.description,
      diagnosis: formData.diagnosis,
      procedure: formData.procedure,
      vitals,
      notes: formData.notes,
      outcome: formData.outcome,
      documentIds: []
    };

    onSaveRecord(recordPayload, {
      allergen: formData.allergen,
      allergySeverity: formData.allergySeverity,
      reaction: formData.reaction,
      medName: formData.medName,
      medDosage: formData.medDosage,
      medFreq: formData.medFreq
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '720px', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div style={{ padding: '20px 28px', backgroundColor: '#1C1C1E', color: '#FFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFF' }}>
                Add Verified Health Record
              </h3>
            </div>
            <div style={{ fontSize: '12px', color: '#A0A0A5', marginTop: '2px' }}>
              Patient: <strong>{patient.name}</strong> ({patient.healthId}) • Staff ID: {currentStaff?.staffId}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Record Type Selector Pills */}
        <div style={{ padding: '16px 28px', backgroundColor: 'var(--bg-canvas)', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700, marginBottom: '8px' }}>
            SELECT CLINICAL RECORD TYPE
          </div>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {RECORD_TYPES.map(t => {
              const Icon = t.icon;
              const isSelected = selectedType === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setSelectedType(t.type)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                    backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                    color: isSelected ? '#111' : '#666',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: isSelected ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <Icon size={14} color={isSelected ? t.color : '#888'} />
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Record Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px', maxHeight: '65vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label htmlFor="rec-title" className="form-label">Record Title / Event Heading *</label>
              <input
                id="rec-title"
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Annual Health Checkup & Vitals"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="rec-date" className="form-label">Date of Encounter *</label>
              <input
                id="rec-date"
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Clinical Facility</label>
              <input
                type="text"
                className="form-input"
                value={currentStaff?.hospital || patient.primaryHospital}
                disabled
                style={{ backgroundColor: '#ECE9E0', color: '#555' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="rec-dept" className="form-label">Department</label>
              <input
                id="rec-dept"
                type="text"
                name="department"
                className="form-input"
                placeholder="e.g. General Surgery, Cardiology"
                value={formData.department}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Dynamic Sections Based on Type */}
          {selectedType === 'SURGERY' && (
            <div style={{ padding: '16px', backgroundColor: '#FEF2F2', borderRadius: '12px', border: '1px solid #FECACA', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Scissors size={16} color="#DC2626" />
                <strong style={{ color: '#991B1B', fontSize: '13px' }}>SURGICAL DETAILS</strong>
              </div>
              <div className="form-group">
                <label htmlFor="rec-procedure" className="form-label">Procedure Name *</label>
                <input
                  id="rec-procedure"
                  type="text"
                  name="procedure"
                  className="form-input"
                  placeholder="e.g. Laparoscopic Cholecystectomy"
                  value={formData.procedure}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          )}

          {selectedType === 'CHECKUP' && (
            <div style={{ padding: '16px', backgroundColor: 'var(--accent-light)', borderRadius: '12px', border: '1px solid rgba(229,154,50,0.3)', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Stethoscope size={16} color="var(--accent-dark)" />
                <strong style={{ color: 'var(--accent-dark)', fontSize: '13px' }}>PHYSICAL VITALS & MEASUREMENTS</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Blood Pressure</label>
                  <input type="text" name="bp" className="form-input" placeholder="120/80" value={formData.bp} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Heart Rate (bpm)</label>
                  <input type="text" name="hr" className="form-input" placeholder="72" value={formData.hr} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>Temp (°F)</label>
                  <input type="text" name="temp" className="form-input" placeholder="98.6" value={formData.temp} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: '11px' }}>SpO2 (%)</label>
                  <input type="text" name="spo2" className="form-input" placeholder="99" value={formData.spo2} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          {selectedType === 'ALLERGY' && (
            <div style={{ padding: '16px', backgroundColor: '#FFFBEB', borderRadius: '12px', border: '1px solid #FCD34D', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <AlertTriangle size={16} color="#D97706" />
                <strong style={{ color: '#92400E', fontSize: '13px' }}>CRITICAL ALLERGY DOCUMENTATION</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Allergen Name *</label>
                  <input type="text" name="allergen" className="form-input" placeholder="e.g. Penicillin, Sulfa" value={formData.allergen} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Severity</label>
                  <select name="allergySeverity" className="form-select" value={formData.allergySeverity} onChange={handleChange}>
                    <option value="Critical">Critical (Anaphylaxis)</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Mild">Mild</option>
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Specific Adverse Reaction</label>
                <input type="text" name="reaction" className="form-input" placeholder="e.g. Laryngeal edema, bronchospasm, urticaria" value={formData.reaction} onChange={handleChange} />
              </div>
            </div>
          )}

          {selectedType === 'MEDICATION' && (
            <div style={{ padding: '16px', backgroundColor: '#EFF6FF', borderRadius: '12px', border: '1px solid #BFDBFE', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <Pill size={16} color="#2563EB" />
                <strong style={{ color: '#1E40AF', fontSize: '13px' }}>PRESCRIPTION DETAILS</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Drug Name *</label>
                  <input type="text" name="medName" className="form-input" placeholder="e.g. Atorvastatin" value={formData.medName} onChange={handleChange} required />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Dosage</label>
                  <input type="text" name="medDosage" className="form-input" placeholder="e.g. 40 mg" value={formData.medDosage} onChange={handleChange} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Frequency</label>
                  <input type="text" name="medFreq" className="form-input" placeholder="e.g. Once daily" value={formData.medFreq} onChange={handleChange} />
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Diagnosis / Clinical Impression</label>
            <input
              type="text"
              name="diagnosis"
              className="form-input"
              placeholder="e.g. Stable post-operative recovery, well controlled."
              value={formData.diagnosis}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Encounter Notes & Description</label>
            <textarea
              name="notes"
              className="form-textarea"
              placeholder="Enter detailed physician notes, physical findings, and instructions..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Clinical Outcome</label>
            <input
              type="text"
              name="outcome"
              className="form-input"
              placeholder="e.g. Recovery completed, follow-up in 6 months."
              value={formData.outcome}
              onChange={handleChange}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircle2 size={16} /> Save Verified Record to Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
