// HealthStory Centralized Longitudinal Patient Record Database — Clean Fresh Slate

export const INITIAL_PATIENTS = [];

export const INITIAL_HEALTH_RECORDS = [];

export const INITIAL_DOCUMENTS = [];

export const INITIAL_AUDIT_LOGS = [];

export const HOSPITALS = [
  { id: "HSP-01", name: "Apex National Medical Center", city: "Seattle, WA" },
  { id: "HSP-02", name: "St. Jude Metropolitan Hospital", city: "San Francisco, CA" },
  { id: "HSP-03", name: "City Care Specialty Institute", city: "Boston, MA" }
];

export const STAFF_ACCOUNTS = [
  {
    staffId: "HSP-482",
    name: "Dr. Sarah Jenkins",
    role: "Chief of Internal Medicine",
    hospital: "Apex National Medical Center",
    hospitalId: "HSP-01",
    password: "admin"
  },
  {
    staffId: "HSP-291",
    name: "Dr. Rajesh Mehra",
    role: "Consultant Surgeon",
    hospital: "City Care Specialty Institute",
    hospitalId: "HSP-03",
    password: "admin"
  },
  {
    staffId: "HSP-108",
    name: "Elena Gomez, RN",
    role: "Lead Clinical Coordinator & Registrar",
    hospital: "Apex National Medical Center",
    hospitalId: "HSP-01",
    password: "admin"
  }
];

// Persistent Database Layer using LocalStorage with RBAC Enforcements
const STORAGE_KEYS = {
  PATIENTS: "healthstory_patients_v2",
  RECORDS: "healthstory_records_v2",
  DOCS: "healthstory_docs_v2",
  AUDIT: "healthstory_audit_v2",
  STAFF: "healthstory_staff_v2"
};

function getStored(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage write error", e);
  }
}

export const StorageService = {
  // Initialize storage if empty
  init() {
    if (localStorage.getItem(STORAGE_KEYS.PATIENTS) === null) {
      setStored(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    }
    if (localStorage.getItem(STORAGE_KEYS.RECORDS) === null) {
      setStored(STORAGE_KEYS.RECORDS, INITIAL_HEALTH_RECORDS);
    }
    if (localStorage.getItem(STORAGE_KEYS.DOCS) === null) {
      setStored(STORAGE_KEYS.DOCS, INITIAL_DOCUMENTS);
    }
    if (localStorage.getItem(STORAGE_KEYS.AUDIT) === null) {
      setStored(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    }
    if (localStorage.getItem(STORAGE_KEYS.STAFF) === null) {
      setStored(STORAGE_KEYS.STAFF, STAFF_ACCOUNTS);
    }
  },

  clearAll() {
    setStored(STORAGE_KEYS.PATIENTS, []);
    setStored(STORAGE_KEYS.RECORDS, []);
    setStored(STORAGE_KEYS.DOCS, []);
    setStored(STORAGE_KEYS.AUDIT, []);
    setStored(STORAGE_KEYS.STAFF, STAFF_ACCOUNTS);
    return { success: true };
  },

  resetDefaults() {
    this.clearAll();
    return { success: true };
  },

  // Staff & Doctor Management
  getStaff() {
    this.init();
    return getStored(STORAGE_KEYS.STAFF, STAFF_ACCOUNTS);
  },

  registerStaff(staffData) {
    const allStaff = this.getStaff();
    const randomNum = Math.floor(100 + Math.random() * 900);
    const cleanStaffId = (staffData.staffId || `DOC-${randomNum}`).trim().toUpperCase();
    
    // Check if staff ID already exists
    const existingIndex = allStaff.findIndex(s => s.staffId?.toUpperCase() === cleanStaffId);
    
    const newStaff = {
      id: staffData.id || `staff-${Date.now()}`,
      staffId: cleanStaffId,
      name: staffData.name?.trim(),
      role: staffData.role?.trim() || "Attending Physician",
      hospital: staffData.hospital?.trim() || "Apex National Medical Center",
      hospitalId: staffData.hospitalId || "HSP-01",
      password: staffData.password || "admin",
      phone: staffData.phone || "",
      email: staffData.email || "",
      registeredAt: new Date().toISOString()
    };

    let updatedStaff;
    if (existingIndex >= 0) {
      updatedStaff = [...allStaff];
      updatedStaff[existingIndex] = { ...updatedStaff[existingIndex], ...newStaff };
    } else {
      updatedStaff = [newStaff, ...allStaff];
    }

    setStored(STORAGE_KEYS.STAFF, updatedStaff);
    return newStaff;
  },

  authenticateStaff(staffId, password) {
    const allStaff = this.getStaff();
    const cleanId = (staffId || "").trim().toUpperCase();
    const staff = allStaff.find(s => s.staffId?.toUpperCase() === cleanId);
    if (!staff) return { success: false, message: `Staff ID "${staffId}" not found.` };
    if (password !== staff.password) return { success: false, message: "Incorrect password." };
    return { success: true, staff };
  },

  // Patients
  getPatients() {
    this.init();
    return getStored(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  },

  getPatientById(id) {
    const patients = this.getPatients();
    return patients.find(p => p.id === id || p.healthId === id) || null;
  },

  getPatientByHealthId(healthId) {
    const patients = this.getPatients();
    const cleanId = (healthId || "").trim().toUpperCase();
    return patients.find(p => p.healthId.toUpperCase() === cleanId) || null;
  },

  // Register New Patient (Admin Only)
  registerPatient(role, staffId, staffName, hospital, patientData) {
    if (role !== "admin") {
      throw new Error("403 Forbidden: Only authorized hospital staff can register new patients.");
    }

    const patients = this.getPatients();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const healthId = `HS-2026-${randomSuffix}`;
    const newId = `pat-${Date.now()}`;

    // calculate age
    const birthYear = new Date(patientData.dateOfBirth).getFullYear();
    const currentYear = new Date().getFullYear();
    const age = currentYear - birthYear || 30;

    const newPatient = {
      id: newId,
      healthId,
      name: patientData.name,
      dateOfBirth: patientData.dateOfBirth,
      age,
      gender: patientData.gender,
      bloodGroup: patientData.bloodGroup,
      phone: patientData.phone,
      email: patientData.email || `${patientData.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      address: patientData.address || "Address on file",
      emergencyContact: {
        name: patientData.emergencyContactName || "Family Contact",
        relation: patientData.emergencyContactRelation || "Relative",
        phone: patientData.emergencyContactPhone || patientData.phone
      },
      primaryHospital: hospital || "Apex National Medical Center",
      status: "Active",
      registeredAt: new Date().toISOString(),
      registeredByStaffId: staffId,
      lastUpdated: new Date().toISOString(),
      activeConditionsCount: patientData.conditions ? patientData.conditions.length : 0,
      activeMedicationsCount: patientData.medications ? patientData.medications.length : 0,
      allergiesCount: patientData.allergies ? patientData.allergies.length : 0,
      surgeriesCount: 0,
      totalRecordsCount: 1,
      allergies: patientData.allergies || [],
      conditions: patientData.conditions || [],
      medications: patientData.medications || []
    };

    patients.unshift(newPatient);
    setStored(STORAGE_KEYS.PATIENTS, patients);

    // Create Initial Registration Health Record
    this.addHealthRecord("admin", staffId, staffName, hospital, {
      patientId: newId,
      healthId,
      type: "CHECKUP",
      year: new Date().getFullYear(),
      date: new Date().toISOString().split("T")[0],
      title: "Patient Intake & HealthStory Registration",
      hospital: hospital || "Apex National Medical Center",
      doctor: staffName || "Authorized Staff",
      department: "Patient Admissions",
      description: `Initial profile registration. Universal Health ID ${healthId} generated. Blood group ${patientData.bloodGroup} documented.`,
      vitals: {
        bloodPressure: "120/80 mmHg",
        heartRate: "72 bpm"
      },
      diagnosis: "New patient registration. Baseline clinical history initialized.",
      procedure: "Identity verification and longitudinal file establishment.",
      medications: (patientData.medications || []).map(m => `${m.name} ${m.dosage || ""}`),
      notes: "Baseline medical record established. Verified by hospital staff.",
      outcome: "Active and verified.",
      documentIds: [],
      verified: true
    });

    // Log to Audit Trail
    this.logAudit({
      patientId: newId,
      healthId,
      patientName: patientData.name,
      staffId,
      staffName,
      hospital,
      action: "Patient Registered",
      recordType: "REGISTRATION",
      recordTitle: `Universal Health ID ${healthId} Generated`,
      details: `Registered ${patientData.name} (${patientData.bloodGroup}, Age ${age}). Initial baseline recorded.`
    });

    return newPatient;
  },

  // Health Records
  getRecords(patientId) {
    this.init();
    const records = getStored(STORAGE_KEYS.RECORDS, INITIAL_HEALTH_RECORDS);
    if (!patientId) return records;
    return records
      .filter(r => r.patientId === patientId || r.healthId === patientId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  // Add Health Record (Admin Only)
  addHealthRecord(role, staffId, staffName, hospital, recordData) {
    if (role !== "admin") {
      throw new Error("403 Forbidden: Patients cannot add medical records. Only authorized hospital staff may append verified records.");
    }

    const records = getStored(STORAGE_KEYS.RECORDS, INITIAL_HEALTH_RECORDS);
    const newRecordId = `rec-${Date.now()}`;
    const year = recordData.date ? new Date(recordData.date).getFullYear() : new Date().getFullYear();

    const newRecord = {
      id: newRecordId,
      patientId: recordData.patientId,
      healthId: recordData.healthId,
      type: recordData.type || "CHECKUP",
      year,
      date: recordData.date || new Date().toISOString().split("T")[0],
      title: recordData.title,
      hospital: hospital || recordData.hospital || "Apex National Medical Center",
      hospitalId: recordData.hospitalId || "HSP-01",
      doctor: staffName || recordData.doctor || "Authorized Staff",
      staffId: staffId || "HSP-482",
      department: recordData.department || "Internal Medicine",
      description: recordData.description || "",
      vitals: recordData.vitals || null,
      diagnosis: recordData.diagnosis || "",
      procedure: recordData.procedure || "",
      medications: Array.isArray(recordData.medications) ? recordData.medications : (recordData.medications ? [recordData.medications] : []),
      notes: recordData.notes || "",
      outcome: recordData.outcome || "Verified and recorded in continuous health story.",
      documentIds: recordData.documentIds || [],
      verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    records.unshift(newRecord);
    setStored(STORAGE_KEYS.RECORDS, records);

    // Update patient record stats & timestamp
    const patients = this.getPatients();
    const patientIndex = patients.findIndex(p => p.id === recordData.patientId || p.healthId === recordData.healthId);
    if (patientIndex !== -1) {
      patients[patientIndex].lastUpdated = new Date().toISOString();
      patients[patientIndex].totalRecordsCount = (patients[patientIndex].totalRecordsCount || 0) + 1;
      if (recordData.type === "SURGERY") {
        patients[patientIndex].surgeriesCount = (patients[patientIndex].surgeriesCount || 0) + 1;
      }
      setStored(STORAGE_KEYS.PATIENTS, patients);
    }

    // Log to Audit
    this.logAudit({
      patientId: recordData.patientId,
      healthId: recordData.healthId,
      patientName: patientIndex !== -1 ? patients[patientIndex].name : "Patient",
      staffId,
      staffName,
      hospital,
      action: `New ${recordData.type} Added`,
      recordType: recordData.type,
      recordTitle: recordData.title,
      details: `Added verified ${recordData.type} record: "${recordData.title}". Doctor: ${staffName || recordData.doctor}.`
    });

    return newRecord;
  },

  // Update Allergy (Admin Only)
  updateAllergies(role, staffId, staffName, hospital, patientId, newAllergy) {
    if (role !== "admin") {
      throw new Error("403 Forbidden: Patients cannot modify allergies. Only authorized healthcare staff may update allergy records.");
    }

    const patients = this.getPatients();
    const patient = patients.find(p => p.id === patientId || p.healthId === patientId);
    if (!patient) throw new Error("Patient not found");

    const allergyEntry = {
      id: `alg-${Date.now()}`,
      allergen: newAllergy.allergen,
      category: newAllergy.category || "Medication",
      severity: newAllergy.severity || "Critical",
      reaction: newAllergy.reaction || "Adverse allergic response",
      documentedDate: new Date().toISOString().split("T")[0],
      source: hospital || "Hospital Clinical Intake",
      verifiedBy: `${staffName} (${staffId})`,
      notes: newAllergy.notes || "Documented during clinical review."
    };

    patient.allergies = patient.allergies || [];
    patient.allergies.unshift(allergyEntry);
    patient.allergiesCount = patient.allergies.length;
    patient.lastUpdated = new Date().toISOString();
    setStored(STORAGE_KEYS.PATIENTS, patients);

    // Audit log
    this.logAudit({
      patientId: patient.id,
      healthId: patient.healthId,
      patientName: patient.name,
      staffId,
      staffName,
      hospital,
      action: "Allergy Documented",
      recordType: "ALLERGY",
      recordTitle: `Allergy: ${newAllergy.allergen} (${newAllergy.severity})`,
      details: `Added ${newAllergy.severity} allergy for ${newAllergy.allergen}. Reaction: ${newAllergy.reaction}.`
    });

    return allergyEntry;
  },

  // Update Medications (Admin Only)
  addMedication(role, staffId, staffName, hospital, patientId, medData) {
    if (role !== "admin") {
      throw new Error("403 Forbidden: Only hospital staff can prescribe or update medication regimens.");
    }

    const patients = this.getPatients();
    const patient = patients.find(p => p.id === patientId || p.healthId === patientId);
    if (!patient) throw new Error("Patient not found");

    const newMed = {
      id: `med-${Date.now()}`,
      name: medData.name,
      dosage: medData.dosage,
      frequency: medData.frequency,
      status: medData.status || "Active",
      startDate: medData.startDate || new Date().toISOString().split("T")[0],
      endDate: medData.endDate || null,
      prescribedBy: `${staffName} (${staffId})`,
      hospital: hospital || "Apex National Medical Center",
      reason: medData.reason || "Clinical treatment"
    };

    patient.medications = patient.medications || [];
    patient.medications.unshift(newMed);
    patient.activeMedicationsCount = patient.medications.filter(m => m.status === "Active").length;
    patient.lastUpdated = new Date().toISOString();
    setStored(STORAGE_KEYS.PATIENTS, patients);

    // Audit
    this.logAudit({
      patientId: patient.id,
      healthId: patient.healthId,
      patientName: patient.name,
      staffId,
      staffName,
      hospital,
      action: "Medication Prescribed",
      recordType: "MEDICATION",
      recordTitle: `${medData.name} ${medData.dosage}`,
      details: `Prescribed ${medData.name} ${medData.dosage} (${medData.frequency}). Reason: ${medData.reason}.`
    });

    return newMed;
  },

  // Documents
  getDocuments(patientId) {
    this.init();
    const docs = getStored(STORAGE_KEYS.DOCS, INITIAL_DOCUMENTS);
    if (!patientId) return docs;
    return docs.filter(d => d.patientId === patientId || d.healthId === patientId);
  },

  uploadDocument(role, staffId, staffName, hospital, docData) {
    if (role !== "admin") {
      throw new Error("403 Forbidden: Patients cannot upload official hospital documents. Uploads restricted to verified clinical staff.");
    }

    const docs = getStored(STORAGE_KEYS.DOCS, INITIAL_DOCUMENTS);
    const newDocId = `DOC-${Math.floor(100 + Math.random() * 900)}`;

    const newDoc = {
      id: newDocId,
      patientId: docData.patientId,
      healthId: docData.healthId,
      title: docData.title.endsWith(".pdf") ? docData.title : `${docData.title}.pdf`,
      category: docData.category || "Lab Reports",
      date: docData.date || new Date().toISOString().split("T")[0],
      hospital: hospital || "Apex National Medical Center",
      uploadedBy: `${staffName} (${staffId})`,
      fileSize: docData.fileSize || "1.8 MB",
      verified: true,
      fileType: "application/pdf",
      reportSummary: docData.reportSummary || "Verified official clinical document attached to patient health story.",
      labValues: docData.labValues || []
    };

    docs.unshift(newDoc);
    setStored(STORAGE_KEYS.DOCS, docs);

    // Audit
    this.logAudit({
      patientId: docData.patientId,
      healthId: docData.healthId,
      patientName: docData.patientName || "Patient",
      staffId,
      staffName,
      hospital,
      action: "Document Uploaded",
      recordType: "DOCUMENT",
      recordTitle: newDoc.title,
      details: `Uploaded ${newDoc.category} document (${newDoc.id}). Verified by ${staffName}.`
    });

    return newDoc;
  },

  // Audit Trail
  getAuditLogs(patientId) {
    this.init();
    const logs = getStored(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    if (!patientId) return logs;
    return logs
      .filter(l => l.patientId === patientId || l.healthId === patientId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  },

  logAudit(entry) {
    const logs = getStored(STORAGE_KEYS.AUDIT, INITIAL_AUDIT_LOGS);
    const logItem = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    logs.unshift(logItem);
    setStored(STORAGE_KEYS.AUDIT, logs);
    return logItem;
  },

  // AI HealthStory Summary (Extractive & Non-Hallucinatory)
  generateAiSummary(patientId) {
    const patient = this.getPatientById(patientId);
    if (!patient) return null;

    const records = this.getRecords(patient.id);
    if (records.length === 0) {
      return {
        title: "HealthStory Summary",
        disclaimer: "No verified clinical records currently on file for this patient.",
        generatedAt: new Date().toISOString(),
        verifiedCount: 0,
        yearsDuration: 0,
        bulletPoints: [
          {
            text: "No documented clinical encounters found.",
            citation: "HealthStory Registry"
          }
        ]
      };
    }

    const yearsRecorded = records.length > 0
      ? new Date().getFullYear() - Math.min(...records.map(r => r.year))
      : 0;

    const surgeries = records.filter(r => r.type === "SURGERY");
    const allergies = patient.allergies || [];
    const activeMeds = (patient.medications || []).filter(m => m.status === "Active");
    const recentCheckup = records.find(r => r.type === "CHECKUP" || r.type === "DIAGNOSIS");

    return {
      title: "HealthStory Verified Summary",
      disclaimer: "This summary is an organizational extraction generated solely from verified clinical records on file. It does not provide diagnoses, treatment advice, or predictive evaluations.",
      generatedAt: new Date().toISOString(),
      verifiedCount: records.length,
      yearsDuration: yearsRecorded || 1,
      bulletPoints: [
        {
          text: `Patient has ${yearsRecorded || 1} year(s) of continuous recorded medical history across ${records.length} verified events.`,
          citation: records[records.length - 1]?.title || "Registration Record",
          recordId: records[records.length - 1]?.id
        },
        {
          text: surgeries.length > 0
            ? `${surgeries.length} previous surgical procedure(s) documented (${surgeries.map(s => s.procedure || s.title).join("; ")}).`
            : "No previous surgical procedures documented on file.",
          citation: surgeries[0]?.title || "Surgical Archive",
          recordId: surgeries[0]?.id
        },
        {
          text: allergies.length > 0
            ? `${allergies.length} high-risk allergy documented: ${allergies.map(a => `${a.allergen} (${a.severity})`).join(", ")}.`
            : "No known medication allergies documented on file.",
          citation: allergies[0] ? `Documented by ${allergies[0].source}` : "Allergy Archive",
          isCritical: allergies.some(a => a.severity === "Critical")
        },
        {
          text: activeMeds.length > 0
            ? `${activeMeds.length} active medication(s) currently prescribed (${activeMeds.map(m => `${m.name} ${m.dosage}`).join(", ")}).`
            : "No active medications documented on file.",
          citation: activeMeds[0] ? `Prescribed by ${activeMeds[0].prescribedBy}` : "Medication List"
        },
        {
          text: recentCheckup
            ? `Most recent verified clinical encounter was on ${new Date(recentCheckup.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} at ${recentCheckup.hospital}.`
            : "No recent clinical encounters recorded.",
          citation: recentCheckup?.title || "Clinical Encounters",
          recordId: recentCheckup?.id
        }
      ]
    };
  }
};
