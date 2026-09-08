import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, ArrowRight, AlertCircle, UserPlus, LogIn, Stethoscope } from 'lucide-react';
import { StorageService, HOSPITALS } from '../data/mockDatabase';

export default function AuthModal({
  isOpen,
  initialTab = 'admin',
  prefillId = '',
  onClose,
  onAdminLogin,
  onDoctorSignUp,
  onPatientLogin,
  patients = []
}) {
  const [tab, setTab] = useState(initialTab); // 'admin' | 'patient'
  const [adminMode, setAdminMode] = useState('signin'); // 'signin' | 'signup'
  const [error, setError] = useState('');

  // Doctor Sign In form state (Clean - No demo details)
  const [staffId, setStaffId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(HOSPITALS[0]?.name || 'Apex National Medical Center');

  // Doctor Sign Up form state
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorRole, setNewDoctorRole] = useState('Attending Physician');
  const [customRole, setCustomRole] = useState('');
  const [newDoctorHospital, setNewDoctorHospital] = useState(HOSPITALS[0]?.name || 'Apex National Medical Center');
  const [newDoctorStaffId, setNewDoctorStaffId] = useState('');
  const [newDoctorPassword, setNewDoctorPassword] = useState('');

  // Patient form state (Clean - No demo details)
  const [healthId, setHealthId] = useState('');
  const [patientDob, setPatientDob] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError('');
      if (initialTab === 'patient' && prefillId) {
        setHealthId(prefillId);
        setPatientDob('');
      } else if (initialTab === 'admin' && prefillId) {
        setStaffId(prefillId);
      }
    }
  }, [isOpen, initialTab, prefillId]);

  if (!isOpen) return null;

  // Handle Doctor Sign In
  const handleAdminSignIn = (e) => {
    e.preventDefault();
    setError('');

    const cleanStaffId = staffId.trim();
    if (!cleanStaffId) {
      setError('Please enter your Staff / Doctor ID.');
      return;
    }
    if (!adminPassword) {
      setError('Please enter your password.');
      return;
    }

    const authRes = StorageService.authenticateStaff(cleanStaffId, adminPassword);
    if (!authRes.success) {
      setError(authRes.message || 'Invalid Doctor ID or password. Please try again or create a new doctor account.');
      return;
    }

    onAdminLogin(authRes.staff, selectedHospital);
    onClose();
  };

  // Handle New Doctor Registration / Sign Up
  const handleDoctorRegister = (e) => {
    e.preventDefault();
    setError('');

    const name = newDoctorName.trim();
    if (!name) {
      setError('Please enter the doctor or physician full name.');
      return;
    }

    const finalRole = newDoctorRole === 'Other' ? (customRole.trim() || 'Attending Physician') : newDoctorRole;
    const finalPassword = newDoctorPassword.trim() || 'admin';
    const finalStaffId = newDoctorStaffId.trim() || `DOC-${Math.floor(100 + Math.random() * 900)}`;

    const hospitalObj = HOSPITALS.find(h => h.name === newDoctorHospital) || HOSPITALS[0];

    const staffPayload = {
      name: name.startsWith('Dr.') ? name : `Dr. ${name}`,
      role: finalRole,
      hospital: newDoctorHospital,
      hospitalId: hospitalObj?.id || 'HSP-01',
      staffId: finalStaffId,
      password: finalPassword
    };

    if (onDoctorSignUp) {
      onDoctorSignUp(staffPayload);
    } else {
      const registered = StorageService.registerStaff(staffPayload);
      onAdminLogin(registered, newDoctorHospital);
    }

    onClose();
  };

  // Handle Patient Sign In
  const handlePatientSubmit = (e) => {
    e.preventDefault();
    setError('');
    const cleanHealthId = healthId.trim().toUpperCase();
    const cleanDob = patientDob.trim();

    if (!cleanHealthId) {
      setError('Please enter your Universal Health ID (e.g. HS-2026-XXXXXX).');
      return;
    }

    if (!cleanDob) {
      setError('Please enter your Date of Birth for identity verification.');
      return;
    }

    const patient = patients.find(p => p.healthId?.toUpperCase() === cleanHealthId) || StorageService.getPatientByHealthId(cleanHealthId);
    if (!patient) {
      setError(`No verified patient found with Health ID "${cleanHealthId}". Please verify your Health ID or contact your hospital.`);
      return;
    }

    // Strict Date of Birth Verification Check
    if (patient.dateOfBirth && patient.dateOfBirth !== cleanDob) {
      setError('Authentication failed: Date of birth does not match the clinical record on file.');
      return;
    }

    onPatientLogin(patient);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '540px', padding: '0', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-canvas)' }}>
          <button
            onClick={() => { setTab('admin'); setError(''); }}
            style={{
              flex: 1,
              padding: '16px 20px',
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              backgroundColor: tab === 'admin' ? '#FFFFFF' : 'transparent',
              color: tab === 'admin' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === 'admin' ? '3px solid var(--accent-primary)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <ShieldCheck size={18} color={tab === 'admin' ? 'var(--accent-primary)' : '#999'} />
            Doctor & Hospital Staff
          </button>

          <button
            onClick={() => { setTab('patient'); setError(''); }}
            style={{
              flex: 1,
              padding: '16px 20px',
              fontFamily: 'var(--font-heading)',
              fontSize: '14px',
              fontWeight: 700,
              border: 'none',
              backgroundColor: tab === 'patient' ? '#FFFFFF' : 'transparent',
              color: tab === 'patient' ? 'var(--text-primary)' : 'var(--text-muted)',
              borderBottom: tab === 'patient' ? '3px solid var(--color-success)' : '3px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <UserCheck size={18} color={tab === 'patient' ? 'var(--color-success)' : '#999'} />
            Patient Portal
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          {error && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--color-critical-bg)',
                color: 'var(--color-critical)',
                fontSize: '13px',
                marginBottom: '18px',
                border: '1px solid rgba(220,38,38,0.2)'
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {tab === 'admin' ? (
            <div>
              {/* Doctor Sign In vs Register Toggle */}
              <div
                style={{
                  display: 'flex',
                  backgroundColor: 'var(--bg-canvas)',
                  padding: '4px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <button
                  type="button"
                  onClick={() => { setAdminMode('signin'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: adminMode === 'signin' ? '#FFFFFF' : 'transparent',
                    color: adminMode === 'signin' ? '#111' : '#666',
                    fontWeight: adminMode === 'signin' ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: adminMode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <LogIn size={15} /> Doctor / Staff Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAdminMode('signup'); setError(''); }}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: adminMode === 'signup' ? '#FFFFFF' : 'transparent',
                    color: adminMode === 'signup' ? '#111' : '#666',
                    fontWeight: adminMode === 'signup' ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    boxShadow: adminMode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <UserPlus size={15} /> Register New Doctor / Staff
                </button>
              </div>

              {adminMode === 'signin' ? (
                /* Doctor Sign In Form */
                <form onSubmit={handleAdminSignIn}>
                  <div className="form-group">
                    <label htmlFor="auth-hospital" className="form-label">Hospital / Clinical Facility</label>
                    <select
                      id="auth-hospital"
                      className="form-select"
                      value={selectedHospital}
                      onChange={e => setSelectedHospital(e.target.value)}
                    >
                      {HOSPITALS.map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.city})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="auth-staff-id" className="form-label">Staff ID / Physician Identifier</label>
                    <input
                      id="auth-staff-id"
                      type="text"
                      className="form-input"
                      placeholder="e.g. DOC-101 or HSP-482"
                      value={staffId}
                      onChange={e => setStaffId(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="auth-password" className="form-label">Password / Security Key</label>
                    <input
                      id="auth-password"
                      type="password"
                      className="form-input"
                      placeholder="Enter your security password"
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '14px' }}>
                    Sign In to Staff Portal <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                /* Register New Doctor Form */
                <form onSubmit={handleDoctorRegister}>
                  <div className="form-group">
                    <label htmlFor="doc-name" className="form-label">Doctor / Staff Full Name</label>
                    <input
                      id="doc-name"
                      type="text"
                      className="form-input"
                      placeholder="e.g. Dr. Jennifer Adams"
                      value={newDoctorName}
                      onChange={e => setNewDoctorName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="doc-role" className="form-label">Clinical Role / Specialization</label>
                    <select
                      id="doc-role"
                      className="form-select"
                      value={newDoctorRole}
                      onChange={e => setNewDoctorRole(e.target.value)}
                    >
                      <option value="Attending Physician">Attending Physician</option>
                      <option value="Chief of Internal Medicine">Chief of Internal Medicine</option>
                      <option value="Consultant Surgeon">Consultant Surgeon</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Emergency Physician">Emergency Physician</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Oncologist">Oncologist</option>
                      <option value="Lead Clinical Coordinator">Lead Clinical Coordinator</option>
                      <option value="Other">Other Specialization</option>
                    </select>
                  </div>

                  {newDoctorRole === 'Other' && (
                    <div className="form-group">
                      <label htmlFor="doc-custom-role" className="form-label">Specify Specialization</label>
                      <input
                        id="doc-custom-role"
                        type="text"
                        className="form-input"
                        placeholder="e.g. Orthopedic Specialist"
                        value={customRole}
                        onChange={e => setCustomRole(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="doc-hospital" className="form-label">Primary Hospital / Medical Center</label>
                    <select
                      id="doc-hospital"
                      className="form-select"
                      value={newDoctorHospital}
                      onChange={e => setNewDoctorHospital(e.target.value)}
                    >
                      {HOSPITALS.map(h => (
                        <option key={h.id} value={h.name}>{h.name} ({h.city})</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label htmlFor="doc-staff-id" className="form-label">Custom Staff ID (Optional)</label>
                      <input
                        id="doc-staff-id"
                        type="text"
                        className="form-input"
                        placeholder="Auto-generated if blank"
                        value={newDoctorStaffId}
                        onChange={e => setNewDoctorStaffId(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="doc-password" className="form-label">Security Password</label>
                      <input
                        id="doc-password"
                        type="password"
                        className="form-input"
                        placeholder="Create password"
                        value={newDoctorPassword}
                        onChange={e => setNewDoctorPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '14px' }}>
                    <Stethoscope size={16} /> Register Doctor & Enter Portal
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Patient Portal Form */
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#111', margin: '0 0 6px 0' }}>Patient Portal</h3>
                <p style={{ fontSize: '13px', color: '#666', lineHeight: 1.5, margin: 0 }}>
                  Secure, read-only personal portal. Enter your verified Universal Health ID and Date of Birth to access your medical records.
                </p>
              </div>

              <form onSubmit={handlePatientSubmit}>
                <div className="form-group">
                  <label htmlFor="auth-health-id" className="form-label">Universal Health ID</label>
                  <input
                    id="auth-health-id"
                    type="text"
                    className="form-input"
                    placeholder="e.g. HS-2026-XXXXXX"
                    value={healthId}
                    onChange={e => setHealthId(e.target.value)}
                    required
                    style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '15px' }}
                  />
                  <span style={{ fontSize: '11px', color: '#777', marginTop: '4px', display: 'block' }}>
                    Issued by your hospital upon registration or on your discharge documentation.
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="auth-dob" className="form-label">Date of Birth (Identity Verification)</label>
                  <input
                    id="auth-dob"
                    type="date"
                    className="form-input"
                    value={patientDob}
                    onChange={e => setPatientDob(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-dark" style={{ width: '100%', marginTop: '14px' }}>
                  View My Health Story <ArrowRight size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
