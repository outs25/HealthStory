import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, UserPlus, Sparkles, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';
import HealthIdCard from '../shared/HealthIdCard';

export default function RegisterPatientModal({
  isOpen,
  onClose,
  onRegisterPatient,
  currentStaff
}) {
  const [step, setStep] = useState(1);
  const [createdPatient, setCreatedPatient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    dateOfBirth: '2000-12-12',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '',
    email: '',
    address: '',
    emergencyContactName: '',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '',
    // Step 2 Medical Data
    knownAllergies: '',
    allergySeverity: 'Moderate',
    existingConditions: '',
    currentMedications: ''
  });

  const resetForm = () => {
    setStep(1);
    setCreatedPatient(null);
    setFormData({
      name: '',
      dateOfBirth: '2000-12-12',
      gender: 'Male',
      bloodGroup: 'A+',
      phone: '',
      email: '',
      address: '',
      emergencyContactName: '',
      emergencyContactRelation: 'Spouse',
      emergencyContactPhone: '',
      knownAllergies: '',
      allergySeverity: 'Moderate',
      existingConditions: '',
      currentMedications: ''
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.phone) {
        alert('Please fill out the patient name and phone number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleCompleteRegistration = async () => {
    // Process allergies array
    const allergiesList = [];
    if (formData.knownAllergies.trim()) {
      formData.knownAllergies.split(',').forEach(item => {
        const trimmed = item.trim();
        if (trimmed) {
          allergiesList.push({
            id: `alg-${Date.now()}-${Math.random()}`,
            allergen: trimmed,
            severity: formData.allergySeverity,
            reaction: 'Documented on intake',
            documentedDate: new Date().toISOString().split('T')[0],
            source: currentStaff?.hospital || 'Hospital Clinical Intake'
          });
        }
      });
    }

    // Process conditions array
    const conditionsList = [];
    if (formData.existingConditions.trim()) {
      formData.existingConditions.split(',').forEach(item => {
        const trimmed = item.trim();
        if (trimmed) {
          conditionsList.push({
            id: `cnd-${Date.now()}-${Math.random()}`,
            condition: trimmed,
            diagnosedDate: new Date().toISOString().split('T')[0],
            hospital: currentStaff?.hospital || 'Hospital Clinical Intake'
          });
        }
      });
    }

    // Process medications array
    const medicationsList = [];
    if (formData.currentMedications.trim()) {
      formData.currentMedications.split(',').forEach(item => {
        const trimmed = item.trim();
        if (trimmed) {
          medicationsList.push({
            id: `med-${Date.now()}-${Math.random()}`,
            name: trimmed,
            dosage: 'As prescribed',
            frequency: 'Daily',
            status: 'Active',
            startDate: new Date().toISOString().split('T')[0]
          });
        }
      });
    }

    const patientPayload = {
      ...formData,
      allergies: allergiesList,
      conditions: conditionsList,
      medications: medicationsList
    };

    try {
      const newPatient = await onRegisterPatient(patientPayload);
      if (newPatient) {
        setCreatedPatient(newPatient);
        setStep(4);

        try {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (err) { }
      }
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '640px', padding: 0, overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header & Progress Indicator */}
        <div style={{ padding: '24px 28px', backgroundColor: '#1C1C1E', color: '#FFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserPlus size={20} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFF' }}>
                Register New Patient
              </h3>
            </div>
            <button
              onClick={handleClose}
              style={{ background: 'transparent', border: 'none', color: '#999', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Stepper Wizard Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step >= 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                  color: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                1
              </span>
              <span style={{ fontSize: '12px', color: step >= 1 ? '#FFF' : '#888', fontWeight: 600 }}>Basic Info</span>
            </div>

            <div style={{ width: '20px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step >= 2 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                  color: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                2
              </span>
              <span style={{ fontSize: '12px', color: step >= 2 ? '#FFF' : '#888', fontWeight: 600 }}>Medical Baseline</span>
            </div>

            <div style={{ width: '20px', height: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step >= 3 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                  color: '#111',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 800
                }}
              >
                3
              </span>
              <span style={{ fontSize: '12px', color: step >= 3 ? '#FFF' : '#888', fontWeight: 600 }}>Health ID</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px', maxHeight: '70vh', overflowY: 'auto' }}>
          {step === 1 && (
            <form onSubmit={handleNext}>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666', marginBottom: '16px' }}>
                STEP 1 — BASIC PATIENT INFORMATION
              </h4>

              <div className="form-group">
                <label htmlFor="reg-name" className="form-label">Full Legal Name *</label>
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  className="form-input"
                  placeholder="e.g. Vikram Malhotra"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label htmlFor="reg-dob" className="form-label">Date of Birth *</label>
                  <input
                    id="reg-dob"
                    type="date"
                    name="dateOfBirth"
                    className="form-input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="reg-gender" className="form-label">Gender *</label>
                  <select
                    id="reg-gender"
                    name="gender"
                    className="form-select"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Non-binary</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label htmlFor="reg-phone" className="form-label">Phone Number *</label>
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phone"
                    className="form-input"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    placeholder="patient@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Residential Address</label>
                <input
                  type="text"
                  name="address"
                  className="form-input"
                  placeholder="Street, City, State, ZIP"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <label className="form-label" style={{ color: 'var(--accent-dark)', marginBottom: '8px', display: 'block' }}>
                  Emergency Contact
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '10px' }}>
                  <input
                    type="text"
                    name="emergencyContactName"
                    className="form-input"
                    placeholder="Contact Name"
                    value={formData.emergencyContactName}
                    onChange={handleChange}
                  />
                  <input
                    type="text"
                    name="emergencyContactRelation"
                    className="form-input"
                    placeholder="Relationship"
                    value={formData.emergencyContactRelation}
                    onChange={handleChange}
                  />
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    className="form-input"
                    placeholder="Phone"
                    value={formData.emergencyContactPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button type="submit" className="btn btn-primary">
                  Proceed to Medical Baseline <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNext}>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666', marginBottom: '16px' }}>
                STEP 2 — BASELINE CLINICAL INFORMATION
              </h4>

              <div className="form-group">
                <label className="form-label">Verified Blood Group *</label>
                <select
                  name="bloodGroup"
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  style={{ fontWeight: 700, color: '#D64545' }}
                >
                  <option value="O+">O Positive (O+)</option>
                  <option value="O-">O Negative (O-)</option>
                  <option value="A+">A Positive (A+)</option>
                  <option value="A-">A Negative (A-)</option>
                  <option value="B+">B Positive (B+)</option>
                  <option value="B-">B Negative (B-)</option>
                  <option value="AB+">AB Positive (AB+)</option>
                  <option value="AB-">AB Negative (AB-)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={14} color="#D64545" />
                  Known Allergies & Contraindications
                </label>
                <input
                  type="text"
                  name="knownAllergies"
                  className="form-input"
                  placeholder="e.g. Penicillin, Sulfa drugs, Latex (comma-separated)"
                  value={formData.knownAllergies}
                  onChange={handleChange}
                />
              </div>

              {formData.knownAllergies && (
                <div className="form-group">
                  <label className="form-label">Allergy Severity Level</label>
                  <select
                    name="allergySeverity"
                    className="form-select"
                    value={formData.allergySeverity}
                    onChange={handleChange}
                  >
                    <option value="Critical">Critical (Anaphylaxis / Severe Risk)</option>
                    <option value="Moderate">Moderate (Hives, Gastrointestinal)</option>
                    <option value="Mild">Mild (Localized rash)</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Existing Chronic Conditions</label>
                <input
                  type="text"
                  name="existingConditions"
                  className="form-input"
                  placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes (comma-separated)"
                  value={formData.existingConditions}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Active Medications</label>
                <input
                  type="text"
                  name="currentMedications"
                  className="form-input"
                  placeholder="e.g. Metformin 500mg, Albuterol Inhaler (comma-separated)"
                  value={formData.currentMedications}
                  onChange={handleChange}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="btn btn-primary">
                  Review & Issue Health ID <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div>
              <h4 style={{ fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#666', marginBottom: '16px' }}>
                STEP 3 — REVIEW & CONFIRMATION
              </h4>

              <div style={{ backgroundColor: 'var(--bg-canvas)', borderRadius: '12px', padding: '18px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#777' }}>Patient Name:</span>
                    <strong style={{ display: 'block', color: '#111', fontSize: '15px' }}>{formData.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#777' }}>Blood Group:</span>
                    <strong style={{ display: 'block', color: '#D64545', fontSize: '15px' }}>{formData.bloodGroup}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#777' }}>Date of Birth:</span>
                    <div style={{ fontWeight: 600 }}>{formData.dateOfBirth} ({formData.gender})</div>
                  </div>
                  <div>
                    <span style={{ color: '#777' }}>Phone Contact:</span>
                    <div style={{ fontWeight: 600 }}>{formData.phone}</div>
                  </div>
                  <div>
                    <span style={{ color: '#777' }}>Hospital:</span>
                    <div style={{ fontWeight: 600 }}>{currentStaff?.hospital}</div>
                  </div>
                  <div>
                    <span style={{ color: '#777' }}>Authorizing Staff:</span>
                    <div style={{ fontWeight: 600 }}>{currentStaff?.name} ({currentStaff?.staffId})</div>
                  </div>
                </div>

                {formData.knownAllergies && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #DDD', fontSize: '12.5px' }}>
                    <strong style={{ color: '#D64545' }}>⚠ Documented Allergies: </strong>
                    <span>{formData.knownAllergies} ({formData.allergySeverity})</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                <button type="button" onClick={() => setStep(2)} className="btn btn-outline">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="button" onClick={handleCompleteRegistration} className="btn btn-primary btn-lg">
                  <Sparkles size={16} /> Confirm & Generate Health ID
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdPatient && (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#EAF7ED',
                  color: '#2E7D32',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}
              >
                <Check size={30} />
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#111', marginBottom: '6px' }}>
                Patient Successfully Registered!
              </h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px' }}>
                Permanent Health ID has been cryptographically generated and registered in the longitudinal archive.
              </p>

              <div style={{ maxWidth: '440px', margin: '0 auto 24px', textAlign: 'left' }}>
                <HealthIdCard patient={createdPatient} isCompact={true} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <button
                  onClick={handleClose}
                  className="btn btn-primary"
                >
                  Open Patient Record →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
