import React, { useState, useEffect } from 'react';
import { StorageService, HOSPITALS } from './data/mockDatabase';
import {
  fetchPatientsFromSupabase,
  fetchRecordsFromSupabase,
  fetchDocumentsFromSupabase,
  fetchAuditLogsFromSupabase,
  registerPatient as registerPatientInSupabase,
  registerStaff as registerStaffInSupabase,
  addHealthRecord as addHealthRecordInSupabase,
  uploadDocument as uploadDocumentInSupabase,
  addAllergy as addAllergyInSupabase,
  addMedication as addMedicationInSupabase,
  subscribeToSupabaseChanges
} from './data/supabaseDatabase';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/admin/AdminDashboard';
import PatientDirectory from './components/admin/PatientDirectory';
import AdminPatientProfile from './components/admin/AdminPatientProfile';
import RegisterPatientModal from './components/admin/RegisterPatientModal';
import AddRecordModal from './components/admin/AddRecordModal';
import PatientDashboard from './components/patient/PatientDashboard';
import DocumentViewerModal from './components/shared/DocumentViewerModal';
import ExportSummaryModal from './components/shared/ExportSummaryModal';
import { testSupabaseConnection } from "./data/testSupabase";

export default function App() {
  // App Core State
  const [currentRole, setCurrentRole] = useState('guest'); // 'guest' | 'admin' | 'patient'
  const [currentStaff, setCurrentStaff] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [selectedAdminPatient, setSelectedAdminPatient] = useState(null);
  const [currentView, setCurrentView] = useState('landing'); // 'landing', 'admin_dashboard', 'admin_patients', 'admin_patient_profile', 'patient_dashboard'

  // Data State
  const [patients, setPatients] = useState([]);
  const [records, setRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('admin');
  const [authPrefillId, setAuthPrefillId] = useState('');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [addRecordModalOpen, setAddRecordModalOpen] = useState(false);
  const [activeViewerDoc, setActiveViewerDoc] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Synchronize and Load from Storage and Supabase Cloud
  const refreshData = async () => {
    StorageService.init();
    const localPatients = StorageService.getPatients();
    const localRecords = StorageService.getRecords();
    const localDocs = StorageService.getDocuments();
    const localAudit = StorageService.getAuditLogs();

    setPatients(localPatients);
    setRecords(localRecords);
    setDocuments(localDocs);
    setAuditLogs(localAudit);

    // Fetch from Supabase cloud
    try {
      const [sbPatients, sbRecords, sbDocs, sbAudit] = await Promise.all([
        fetchPatientsFromSupabase(),
        fetchRecordsFromSupabase(),
        fetchDocumentsFromSupabase(),
        fetchAuditLogsFromSupabase(),
      ]);

      if (sbPatients && sbPatients.length > 0) {
        const merged = [...sbPatients];
        localPatients.forEach((lp) => {
          if (!merged.some((sp) => sp.healthId === lp.healthId || sp.id === lp.id)) {
            merged.push(lp);
          }
        });
        setPatients(merged);
      }

      if (sbRecords && sbRecords.length > 0) {
        const mergedRecs = [...sbRecords];
        localRecords.forEach((lr) => {
          if (!mergedRecs.some((sr) => sr.id === lr.id)) {
            mergedRecs.push(lr);
          }
        });
        setRecords(mergedRecs);
      }

      if (sbDocs && sbDocs.length > 0) {
        const mergedDocs = [...sbDocs];
        localDocs.forEach((ld) => {
          if (!mergedDocs.some((sd) => sd.id === ld.id)) {
            mergedDocs.push(ld);
          }
        });
        setDocuments(mergedDocs);
      }

      if (sbAudit && sbAudit.length > 0) {
        const mergedAudit = [...sbAudit];
        localAudit.forEach((la) => {
          if (!mergedAudit.some((sa) => sa.id === la.id)) {
            mergedAudit.push(la);
          }
        });
        setAuditLogs(mergedAudit);
      }
    } catch (err) {
      console.warn('Supabase fetch notice:', err);
    }
  };

  useEffect(() => {
    refreshData();
    testSupabaseConnection();

    // Subscribe to Supabase Realtime changes
    const unsubscribe = subscribeToSupabaseChanges(() => {
      refreshData();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  // Synchronize current patient when data updates
  useEffect(() => {
    if (currentPatient) {
      const updated = patients.find(p => p.id === currentPatient.id || p.healthId === currentPatient.healthId) || StorageService.getPatientById(currentPatient.id);
      if (updated) setCurrentPatient(updated);
    }
    if (selectedAdminPatient) {
      const updated = patients.find(p => p.id === selectedAdminPatient.id || p.healthId === selectedAdminPatient.healthId) || StorageService.getPatientById(selectedAdminPatient.id);
      if (updated) setSelectedAdminPatient(updated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients, records, documents, auditLogs]);

  // Auth Handlers
  const handleOpenAuth = (tab = 'admin', prefillId = null) => {
    setAuthInitialTab(tab);
    setAuthPrefillId(prefillId || '');
    setAuthModalOpen(true);
  };

  const handleAdminLogin = (staff, hospital) => {
    setCurrentRole('admin');
    setCurrentStaff({
      ...staff,
      hospital: hospital || staff.hospital
    });
    setCurrentPatient(null);
    setCurrentView('admin_dashboard');
    showToast(`Welcome, ${staff.name}. Doctor & Staff Portal active.`);
  };

  const handleDoctorSignUp = async (doctorData) => {
    try {
      const newStaff = StorageService.registerStaff(doctorData);
      registerStaffInSupabase(newStaff).catch((err) => {
        console.warn('Supabase staff sync notice:', err);
      });
      handleAdminLogin(newStaff, newStaff.hospital);
      showToast(`Welcome, ${newStaff.name}! Your Doctor Staff Account (${newStaff.staffId}) is active.`);
    } catch (err) {
      console.error('Doctor registration error:', err);
      showToast(err.message || 'Could not register doctor.', 'critical');
    }
  };

  const handlePatientLogin = (patient) => {
    if (!patient || !patient.name) {
      handleOpenAuth('patient');
      showToast('Please enter your Universal Health ID and Date of Birth to view records.', 'info');
      return;
    }
    setCurrentRole('patient');
    setCurrentPatient(patient);
    setCurrentStaff(null);
    setCurrentView('patient_dashboard');
    showToast(`Welcome, ${patient.name}. Viewing your verified Health Story.`);
  };

  const handleLogout = () => {
    setCurrentRole('guest');
    setCurrentStaff(null);
    setCurrentPatient(null);
    setSelectedAdminPatient(null);
    setCurrentView('landing');
    showToast('Signed out successfully.', 'info');
  };

  const handleResetData = () => {
    StorageService.resetDefaults();
    refreshData();
    showToast('Reset database to initial verified demo records.');
  };

  // Patient Actions (Admin Only)
  const handleRegisterPatient = async (formData) => {
    try {
      const staffId = currentStaff?.staffId || 'HSP-482';
      const staffName = currentStaff?.name || 'Dr. Sarah Jenkins';
      const hospital = currentStaff?.hospital || HOSPITALS[0]?.name || 'Apex National Medical Center';
      const hospitalId = currentStaff?.hospitalId || 'HSP-01';

      // 1. Primary Registration: Creates patient record, initial intake health record, and audit log
      const newPatient = StorageService.registerPatient(
        'admin',
        staffId,
        staffName,
        hospital,
        formData
      );

      // 2. Sync with Supabase Cloud in background
      registerPatientInSupabase({
        ...newPatient,
        emergencyContactName: formData.emergencyContactName || newPatient.emergencyContact?.name,
        emergencyContactRelation: formData.emergencyContactRelation || newPatient.emergencyContact?.relation,
        emergencyContactPhone: formData.emergencyContactPhone || newPatient.emergencyContact?.phone,
        hospitalId,
        registeredByStaffId: staffId,
        registeredByStaffName: staffName,
      }).catch((sbErr) => {
        console.warn('Supabase sync notice:', sbErr);
      });

      // 3. Update application state and switch to patient view
      refreshData();
      setSelectedAdminPatient(newPatient);
      setCurrentView('admin_patient_profile');

      showToast(
        `Registered patient ${newPatient.name} with Health ID ${newPatient.healthId}!`
      );

      return newPatient;
    } catch (err) {
      console.error('Registration error:', err);
      showToast(
        err.message || 'Could not register patient.',
        'critical'
      );
      return null;
    }
  };

  const handleSaveRecord = async (recordPayload, additionalDetails) => {
    try {
      const staffId = currentStaff?.staffId || 'HSP-482';
      const staffName = currentStaff?.name || 'Authorized Physician';
      const hospital = currentStaff?.hospital || selectedAdminPatient?.primaryHospital || 'Apex National Medical Center';
      const hospitalId = currentStaff?.hospitalId || 'HSP-01';

      StorageService.addHealthRecord(
        'admin',
        staffId,
        staffName,
        hospital,
        recordPayload
      );

      // Sync record to Supabase
      try {
        await addHealthRecordInSupabase({
          ...recordPayload,
          patientId: selectedAdminPatient.id,
          hospitalId,
          doctor: staffName,
          staffId,
        });
      } catch (sbErr) {
        console.warn('Supabase record sync notice:', sbErr);
      }

      // If record included allergy details, save allergy
      if (recordPayload.type === 'ALLERGY' && additionalDetails?.allergen) {
        const allergyData = {
          allergen: additionalDetails.allergen,
          severity: additionalDetails.allergySeverity || 'Critical',
          reaction: additionalDetails.reaction || 'Adverse allergic reaction'
        };
        StorageService.updateAllergies(
          'admin',
          staffId,
          staffName,
          hospital,
          selectedAdminPatient.id,
          allergyData
        );
        try {
          await addAllergyInSupabase(selectedAdminPatient.id, allergyData);
        } catch (sbErr) { }
      }

      // If record included medication details, save medication
      if (recordPayload.type === 'MEDICATION' && additionalDetails?.medName) {
        const medData = {
          name: additionalDetails.medName,
          dosage: additionalDetails.medDosage || 'Standard dose',
          frequency: additionalDetails.medFreq || 'Once daily',
          reason: recordPayload.description || 'Clinical treatment'
        };
        StorageService.addMedication(
          'admin',
          staffId,
          staffName,
          hospital,
          selectedAdminPatient.id,
          medData
        );
        try {
          await addMedicationInSupabase(selectedAdminPatient.id, medData);
        } catch (sbErr) { }
      }

      refreshData();
      showToast(`Record "${recordPayload.title}" verified and saved to Health Story!`);
    } catch (err) {
      showToast(err.message, 'critical');
    }
  };

  const handleAddAllergy = async (patientId, allergyData) => {
    try {
      const staffId = currentStaff?.staffId || 'HSP-482';
      const staffName = currentStaff?.name || 'Authorized Physician';
      const hospital = currentStaff?.hospital;

      StorageService.updateAllergies(
        'admin',
        staffId,
        staffName,
        hospital,
        patientId,
        allergyData
      );

      try {
        await addAllergyInSupabase(patientId, allergyData);
      } catch (sbErr) {
        console.warn('Supabase allergy sync notice:', sbErr);
      }

      refreshData();
      showToast(`Documented allergy for ${allergyData.allergen} (${allergyData.severity}).`);
    } catch (err) {
      showToast(err.message, 'critical');
    }
  };

  const handleAddMedication = async (patientId, medData) => {
    try {
      const staffId = currentStaff?.staffId || 'HSP-482';
      const staffName = currentStaff?.name || 'Authorized Physician';
      const hospital = currentStaff?.hospital;

      StorageService.addMedication(
        'admin',
        staffId,
        staffName,
        hospital,
        patientId,
        medData
      );

      try {
        await addMedicationInSupabase(patientId, medData);
      } catch (sbErr) {
        console.warn('Supabase medication sync notice:', sbErr);
      }

      refreshData();
      showToast(`Prescription for ${medData.name} saved to active medications.`);
    } catch (err) {
      showToast(err.message, 'critical');
    }
  };

  const handleUploadDocument = async (docPayload) => {
    try {
      const staffId = currentStaff?.staffId || 'HSP-482';
      const staffName = currentStaff?.name || 'Authorized Physician';
      const hospital = currentStaff?.hospital;
      const hospitalId = currentStaff?.hospitalId || 'HSP-01';

      const doc = StorageService.uploadDocument(
        'admin',
        staffId,
        staffName,
        hospital,
        docPayload
      );

      try {
        await uploadDocumentInSupabase({
          ...docPayload,
          patientId: selectedAdminPatient.id,
          hospitalId,
          uploadedBy: staffName,
        });
      } catch (sbErr) {
        console.warn('Supabase doc sync notice:', sbErr);
      }

      refreshData();
      showToast(`Document "${doc.title}" verified and uploaded.`);
    } catch (err) {
      showToast(err.message, 'critical');
    }
  };

  // Patient select in Admin
  const handleSelectAdminPatient = (patient) => {
    setSelectedAdminPatient(patient);
    setCurrentView('admin_patient_profile');
  };

  // Active patient records & documents
  const activePatientObj = currentRole === 'patient' ? currentPatient : selectedAdminPatient;
  const activePatientRecords = activePatientObj ? StorageService.getRecords(activePatientObj.id) : [];
  const activePatientDocuments = activePatientObj ? StorageService.getDocuments(activePatientObj.id) : [];
  const activePatientAudit = activePatientObj ? StorageService.getAuditLogs(activePatientObj.id) : [];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-canvas)' }}>
      {/* Navigation Header */}
      <Navbar
        currentRole={currentRole}
        currentStaff={currentStaff}
        currentPatient={currentPatient}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'landing') setCurrentView('landing');
          else if (view === 'admin_dashboard') setCurrentView('admin_dashboard');
          else if (view === 'admin_patients') setCurrentView('admin_patients');
          else if (view === 'patient_dashboard') setCurrentView('patient_dashboard');
        }}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onResetData={handleResetData}
        onSelectPatient={(p) => {
          if (currentRole === 'admin') {
            handleSelectAdminPatient(p);
          } else {
            handlePatientLogin(p);
          }
        }}
        patients={patients}
      />

      {/* Toast Notification Banner */}
      {toast && (
        <div
          className="no-print"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: toast.type === 'critical' ? '#DC2626' : '#18191B',
            color: '#FFFFFF',
            padding: '14px 22px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-floating)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '13.5px',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.15)',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Dynamic Viewport */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage
            onExplore={(role = 'patient') => {
              if (role === 'patient') {
                if (patients.length > 0) {
                  handlePatientLogin(patients[0]);
                } else {
                  handleOpenAuth('patient');
                  showToast('Please enter your Universal Health ID or sign in.', 'info');
                }
              } else {
                handleOpenAuth('admin');
              }
            }}
            onOpenAuth={handleOpenAuth}
            onSelectPatient={(p) => {
              handlePatientLogin(p);
            }}
            patients={patients}
          />
        )}

        {currentRole === 'admin' && currentView === 'admin_dashboard' && (
          <AdminDashboard
            currentStaff={currentStaff}
            patients={patients}
            records={records}
            auditLogs={auditLogs}
            onSelectPatient={handleSelectAdminPatient}
            onOpenRegister={() => setRegisterModalOpen(true)}
            onOpenAddRecord={() => {
              if (patients.length > 0) {
                setSelectedAdminPatient(patients[0]);
                setAddRecordModalOpen(true);
              }
            }}
            onViewPatients={() => setCurrentView('admin_patients')}
            onViewDocument={(doc) => setActiveViewerDoc(doc)}
          />
        )}

        {currentRole === 'admin' && currentView === 'admin_patients' && (
          <PatientDirectory
            patients={patients}
            onSelectPatient={handleSelectAdminPatient}
            onOpenRegister={() => setRegisterModalOpen(true)}
          />
        )}

        {currentRole === 'admin' && currentView === 'admin_patient_profile' && selectedAdminPatient && (
          <AdminPatientProfile
            patient={selectedAdminPatient}
            records={activePatientRecords}
            documents={activePatientDocuments}
            auditLogs={activePatientAudit}
            currentStaff={currentStaff}
            onBack={() => setCurrentView('admin_patients')}
            onOpenAddRecord={() => setAddRecordModalOpen(true)}
            onOpenExportSummary={() => setExportModalOpen(true)}
            onViewDocument={(doc) => setActiveViewerDoc(doc)}
            onUploadDocument={handleUploadDocument}
            onAddAllergy={handleAddAllergy}
            onAddMedication={handleAddMedication}
          />
        )}

        {currentRole === 'patient' && currentView === 'patient_dashboard' && currentPatient && (
          <PatientDashboard
            patient={currentPatient}
            records={activePatientRecords}
            documents={activePatientDocuments}
            auditLogs={activePatientAudit}
            onViewDocument={(doc) => setActiveViewerDoc(doc)}
            onOpenExportSummary={() => setExportModalOpen(true)}
          />
        )}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialTab={authInitialTab}
        prefillId={authPrefillId}
        onClose={() => setAuthModalOpen(false)}
        onAdminLogin={handleAdminLogin}
        onDoctorSignUp={handleDoctorSignUp}
        onPatientLogin={handlePatientLogin}
        patients={patients}
      />

      <RegisterPatientModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onRegisterPatient={handleRegisterPatient}
        currentStaff={currentStaff}
      />

      <AddRecordModal
        isOpen={addRecordModalOpen}
        patient={selectedAdminPatient}
        currentStaff={currentStaff}
        onClose={() => setAddRecordModalOpen(false)}
        onSaveRecord={handleSaveRecord}
      />

      <DocumentViewerModal
        document={activeViewerDoc}
        onClose={() => setActiveViewerDoc(null)}
        onDownload={(doc) => {
          showToast(`Downloaded verified report: ${doc.title}`);
          window.print();
        }}
      />

      <ExportSummaryModal
        isOpen={exportModalOpen}
        patient={activePatientObj}
        records={activePatientRecords}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
