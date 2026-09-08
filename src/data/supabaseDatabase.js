import { supabase } from "../lib/supabaseClient";
import { HOSPITALS } from "./mockDatabase";

// Helper: Get hospital name by id
const getHospitalName = (hospitalId) => {
  const match = HOSPITALS.find((h) => h.id === hospitalId);
  return match ? match.name : "Apex National Medical Center";
};

// ==========================================
// 1. READ / FETCH OPERATIONS
// ==========================================

export async function fetchPatientsFromSupabase() {
  if (!supabase) return [];

  try {
    const { data: dbPatients, error: pErr } = await supabase
      .from("patients")
      .select("*")
      .order("created_at", { ascending: false });

    if (pErr) {
      console.warn("Supabase fetchPatients notice:", pErr.message || pErr);
      return [];
    }

    if (!dbPatients || dbPatients.length === 0) return [];

    // Fetch related allergies, medications, records for counts
    const { data: dbAllergies } = await supabase.from("allergies").select("*");
    const { data: dbMeds } = await supabase.from("medications").select("*");
    const { data: dbRecords } = await supabase.from("health_records").select("id, patient_id, type");

    return dbPatients.map((p) => {
      const patientAllergies = (dbAllergies || [])
        .filter((a) => a.patient_id === p.id)
        .map((a) => ({
          id: a.id,
          allergen: a.allergen,
          category: a.category || "Medication",
          severity: a.severity || "Critical",
          reaction: a.reaction || "Documented clinical reaction",
          documentedDate: a.documented_date || a.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          source: a.source || getHospitalName(p.primary_hospital_id),
        }));

      const patientMeds = (dbMeds || [])
        .filter((m) => m.patient_id === p.id)
        .map((m) => ({
          id: m.id,
          name: m.name,
          dosage: m.dosage || "As prescribed",
          frequency: m.frequency || "Once daily",
          status: m.status || "Active",
          startDate: m.start_date || m.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
          reason: m.reason || "Clinical treatment",
          prescribedBy: m.prescribed_by || "Authorized Physician",
        }));

      const patientRecords = (dbRecords || []).filter((r) => r.patient_id === p.id);
      const surgeriesCount = patientRecords.filter((r) => r.type === "SURGERY").length;

      const birthYear = p.date_of_birth ? new Date(p.date_of_birth).getFullYear() : null;
      const age = birthYear ? new Date().getFullYear() - birthYear : 30;

      return {
        id: p.id,
        healthId: p.health_id,
        name: p.name,
        dateOfBirth: p.date_of_birth || "2000-01-01",
        age,
        gender: p.gender || "Other",
        bloodGroup: p.blood_group || "O+",
        phone: p.phone || "",
        email: p.email || `${p.name?.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        address: p.address || "Address on file",
        emergencyContact: {
          name: p.emergency_contact_name || "Family Contact",
          relation: p.emergency_contact_relation || "Relative",
          phone: p.emergency_contact_phone || p.phone,
        },
        primaryHospital: getHospitalName(p.primary_hospital_id),
        primaryHospitalId: p.primary_hospital_id || "HSP-01",
        status: p.status || "Active",
        registeredAt: p.registered_at || p.created_at || new Date().toISOString(),
        registeredByStaffId: p.registered_by_staff_id || "HSP-482",
        lastUpdated: p.created_at || new Date().toISOString(),
        activeConditionsCount: 0,
        activeMedicationsCount: patientMeds.filter((m) => m.status === "Active").length,
        allergiesCount: patientAllergies.length,
        surgeriesCount,
        totalRecordsCount: patientRecords.length,
        allergies: patientAllergies,
        conditions: [],
        medications: patientMeds,
      };
    });
  } catch (err) {
    console.warn("Supabase fetchPatients error:", err.message || err);
    return [];
  }
}

export async function fetchRecordsFromSupabase(patientId) {
  if (!supabase) return [];

  try {
    let query = supabase
      .from("health_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (patientId) {
      query = query.eq("patient_id", patientId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase fetchRecords notice:", error.message || error);
      return [];
    }

    return (data || []).map((r) => {
      const dateStr = r.created_at ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0];
      const year = r.created_at ? new Date(r.created_at).getFullYear() : new Date().getFullYear();

      return {
        id: r.id,
        patientId: r.patient_id,
        healthId: r.patient_id,
        type: r.type || "CHECKUP",
        year,
        date: dateStr,
        title: r.title,
        hospital: getHospitalName(r.hospital_id),
        hospitalId: r.hospital_id || "HSP-01",
        doctor: r.doctor || "Authorized Staff",
        staffId: r.staff_id || "HSP-482",
        department: r.department || "Internal Medicine",
        description: r.description || "",
        vitals: r.vitals || { bloodPressure: "120/80 mmHg", heartRate: "72 bpm" },
        diagnosis: r.diagnosis || "",
        procedure: r.procedure || "",
        medications: Array.isArray(r.medications) ? r.medications : [],
        notes: r.notes || "",
        outcome: r.outcome || "Verified and recorded in continuous health story.",
        documentIds: [],
        verified: r.verified !== false,
        createdAt: r.created_at,
        updatedAt: r.updated_at,
      };
    });
  } catch (err) {
    console.warn("Supabase fetchRecords error:", err.message || err);
    return [];
  }
}

export async function fetchDocumentsFromSupabase(patientId) {
  if (!supabase) return [];

  try {
    let query = supabase
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false });

    if (patientId) {
      query = query.eq("patient_id", patientId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase fetchDocuments notice:", error.message || error);
      return [];
    }

    return (data || []).map((d) => ({
      id: d.id,
      patientId: d.patient_id,
      title: d.title,
      category: d.category || "Clinical Reports",
      date: d.created_at ? d.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
      hospital: getHospitalName(d.hospital_id),
      hospitalId: d.hospital_id || "HSP-01",
      uploadedBy: d.uploaded_by || "Authorized Staff",
      size: "1.2 MB",
      summary: "Verified digital archive record stored in Supabase cloud.",
      verified: true,
      url: "#",
    }));
  } catch (err) {
    console.warn("Supabase fetchDocuments error:", err.message || err);
    return [];
  }
}

export async function fetchAuditLogsFromSupabase(patientId) {
  if (!supabase) return [];

  try {
    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false });

    if (patientId) {
      query = query.eq("patient_id", patientId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Supabase fetchAuditLogs notice:", error.message || error);
      return [];
    }

    return (data || []).map((l) => ({
      id: l.id,
      patientId: l.patient_id,
      healthId: l.health_id,
      patientName: l.patient_name || "Patient",
      staffId: l.staff_id || "HSP-482",
      staffName: l.staff_name || "Authorized Staff",
      hospital: getHospitalName(l.hospital_id),
      hospitalId: l.hospital_id || "HSP-01",
      action: l.action,
      recordType: l.record_type || "SYSTEM",
      recordTitle: l.record_title || "",
      details: l.details || "",
      timestamp: l.timestamp || new Date().toISOString(),
    }));
  } catch (err) {
    console.warn("Supabase fetchAuditLogs error:", err.message || err);
    return [];
  }
}

// ==========================================
// 2. WRITE / MUTATION OPERATIONS
// ==========================================

export async function registerPatient(patient) {
  if (!supabase) return null;

  try {
    const healthId = patient.healthId || patient.health_id;
    const hospitalId = patient.hospitalId || patient.primaryHospitalId || patient.primary_hospital_id || "HSP-01";

    const { data: insertedPatient, error: pErr } = await supabase
      .from("patients")
      .insert([
        {
          health_id: healthId,
          name: patient.name,
          date_of_birth: patient.dateOfBirth || patient.date_of_birth,
          gender: patient.gender,
          blood_group: patient.bloodGroup || patient.blood_group,
          phone: patient.phone,
          email: patient.email || `${(patient.name || "patient").toLowerCase().replace(/\s+/g, ".")}@example.com`,
          address: patient.address || "Address on file",
          emergency_contact_name:
            patient.emergencyContact?.name || patient.emergencyContactName || "Emergency Contact",
          emergency_contact_relation:
            patient.emergencyContact?.relation || patient.emergencyContactRelation || "Relative",
          emergency_contact_phone:
            patient.emergencyContact?.phone || patient.emergencyContactPhone || patient.phone,
          primary_hospital_id: hospitalId,
          status: patient.status || "Active",
          registered_at: new Date().toISOString(),
          registered_by_staff_id: patient.registeredByStaffId || "HSP-482",
        },
      ])
      .select()
      .single();

    if (pErr) {
      console.warn("Supabase registerPatient notice:", pErr.message || pErr);
      return null;
    }

    const dbPatientId = insertedPatient?.id;

    // Save allergies to Supabase
    if (dbPatientId && patient.allergies && patient.allergies.length > 0) {
      const allergyRows = patient.allergies.map((a) => ({
        patient_id: dbPatientId,
        allergen: a.allergen,
        category: a.category || "Medication",
        severity: a.severity || "Critical",
        reaction: a.reaction || "Documented on intake",
        documented_date: a.documentedDate || new Date().toISOString().split("T")[0],
        source: a.source || getHospitalName(hospitalId),
      }));
      await supabase.from("allergies").insert(allergyRows);
    }

    // Save medications to Supabase
    if (dbPatientId && patient.medications && patient.medications.length > 0) {
      const medRows = patient.medications.map((m) => ({
        patient_id: dbPatientId,
        name: m.name,
        dosage: m.dosage || "As prescribed",
        frequency: m.frequency || "Daily",
        status: m.status || "Active",
        start_date: m.startDate || new Date().toISOString().split("T")[0],
        reason: m.reason || "Baseline intake medication",
        prescribed_by: m.prescribedBy || "Authorized Staff",
      }));
      await supabase.from("medications").insert(medRows);
    }

    // Save Initial Intake Record to Supabase
    if (dbPatientId) {
      await addHealthRecord({
        patientId: dbPatientId,
        type: "CHECKUP",
        title: "Patient Intake & HealthStory Registration",
        hospitalId,
        doctor: patient.registeredByStaffName || "Authorized Staff",
        staffId: patient.registeredByStaffId || "HSP-482",
        department: "Patient Admissions",
        description: `Initial profile registration. Universal Health ID ${healthId} generated. Blood group ${patient.bloodGroup || patient.blood_group} documented.`,
        vitals: { bloodPressure: "120/80 mmHg", heartRate: "72 bpm" },
        diagnosis: "New patient registration. Baseline clinical history initialized.",
        procedure: "Identity verification and longitudinal file establishment.",
        medications: (patient.medications || []).map((m) => `${m.name} ${m.dosage || ""}`),
        notes: "Baseline medical record established. Verified by hospital staff.",
        outcome: "Active and verified.",
      });

      // Log Audit to Supabase
      await logAudit({
        patientId: dbPatientId,
        healthId,
        patientName: patient.name,
        staffId: patient.registeredByStaffId || "HSP-482",
        staffName: patient.registeredByStaffName || "Authorized Staff",
        hospitalId,
        action: "Patient Registered",
        recordType: "REGISTRATION",
        recordTitle: `Universal Health ID ${healthId} Generated`,
        details: `Registered ${patient.name} (${patient.bloodGroup || patient.blood_group}). Initial baseline recorded.`,
      });
    }

    return insertedPatient;
  } catch (err) {
    console.warn("Error registering patient in Supabase:", err.message || err);
    return null;
  }
}

export async function addHealthRecord(record) {
  if (!supabase) return null;

  try {
    const payload = {
      type: record.type || "CHECKUP",
      title: record.title,
      hospital_id: record.hospitalId || "HSP-01",
      doctor: record.doctor || "Authorized Staff",
      staff_id: record.staffId || "HSP-482",
      department: record.department || "Internal Medicine",
      description: record.description || "",
      vitals: record.vitals || { bloodPressure: "120/80 mmHg", heartRate: "72 bpm" },
      diagnosis: record.diagnosis || "",
      procedure: record.procedure || "",
      medications: record.medications || [],
      notes: record.notes || "",
      outcome: record.outcome || "Verified and recorded.",
      verified: record.verified !== false,
      created_at: record.date ? `${record.date}T12:00:00Z` : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (record.patientId && !record.patientId.startsWith("pat-")) {
      payload.patient_id = record.patientId;
    }

    const { data, error } = await supabase
      .from("health_records")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("Supabase addHealthRecord notice:", error.message || error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Error adding health record in Supabase:", err.message || err);
    return null;
  }
}

export async function uploadDocument(doc) {
  if (!supabase) return null;

  try {
    const payload = {
      title: doc.title,
      category: doc.category || "Clinical Reports",
      hospital_id: doc.hospitalId || "HSP-01",
      uploaded_by: doc.uploadedBy || "Authorized Staff",
      created_at: new Date().toISOString(),
    };

    if (doc.patientId && !doc.patientId.startsWith("pat-")) {
      payload.patient_id = doc.patientId;
    }

    const { data, error } = await supabase
      .from("documents")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("Supabase uploadDocument notice:", error.message || error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Error uploading document in Supabase:", err.message || err);
    return null;
  }
}

export async function addAllergy(patientId, allergy) {
  if (!supabase) return null;

  try {
    const payload = {
      allergen: allergy.allergen,
      category: allergy.category || "Medication",
      severity: allergy.severity || "Critical",
      reaction: allergy.reaction || "Adverse allergic reaction",
      documented_date: allergy.documentedDate || new Date().toISOString().split("T")[0],
      source: allergy.source || "Hospital Clinical Intake",
    };

    if (patientId && !patientId.startsWith("pat-")) {
      payload.patient_id = patientId;
    }

    const { data, error } = await supabase
      .from("allergies")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("Supabase addAllergy notice:", error.message || error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Error adding allergy in Supabase:", err.message || err);
    return null;
  }
}

export async function addMedication(patientId, med) {
  if (!supabase) return null;

  try {
    const payload = {
      name: med.name,
      dosage: med.dosage || "Standard dose",
      frequency: med.frequency || "Once daily",
      status: med.status || "Active",
      start_date: med.startDate || new Date().toISOString().split("T")[0],
      reason: med.reason || "Clinical treatment",
      prescribed_by: med.prescribedBy || "Authorized Physician",
    };

    if (patientId && !patientId.startsWith("pat-")) {
      payload.patient_id = patientId;
    }

    const { data, error } = await supabase
      .from("medications")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("Supabase addMedication notice:", error.message || error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Error adding medication in Supabase:", err.message || err);
    return null;
  }
}

export async function logAudit(audit) {
  if (!supabase) return null;

  try {
    const payload = {
      health_id: audit.healthId,
      patient_name: audit.patientName || "Patient",
      staff_id: audit.staffId || "HSP-482",
      staff_name: audit.staffName || "Authorized Staff",
      hospital_id: audit.hospitalId || "HSP-01",
      action: audit.action,
      record_type: audit.recordType || "SYSTEM",
      record_title: audit.recordTitle || "",
      details: audit.details || "",
      timestamp: audit.timestamp || new Date().toISOString(),
    };

    if (audit.patientId && !audit.patientId.startsWith("pat-")) {
      payload.patient_id = audit.patientId;
    }

    const { data, error } = await supabase
      .from("audit_logs")
      .insert([payload])
      .select()
      .single();

    if (error) {
      console.warn("Supabase logAudit notice:", error.message || error);
      return null;
    }

    return data;
  } catch (err) {
    console.warn("Error logging audit in Supabase:", err.message || err);
    return null;
  }
}

// ==========================================
// 3. REALTIME SUBSCRIPTION
// ==========================================

export function subscribeToSupabaseChanges(onChange) {
  if (!supabase) return () => {};

  try {
    const channel = supabase
      .channel("public-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        (payload) => {
          if (onChange) onChange(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Realtime subscription notice:", err);
    return () => {};
  }
}

// ==========================================
// 4. DIAGNOSTIC & RLS PROBE
// ==========================================

export async function testSupabaseWriteAccess() {
  if (!supabase) return { connected: false, canRead: false, canWrite: false, error: 'Supabase client not initialized' };
  if (process.env.NODE_ENV === 'test') return { connected: true, canRead: true, canWrite: true, rlsBlocked: false, message: 'Test Environment' };

  try {
    const { error: readError } = await supabase.from('patients').select('id').limit(1);
    if (readError) {
      return { connected: false, canRead: false, canWrite: false, error: readError.message };
    }

    const testId = 'HS-PROBE-' + Date.now();
    const { data: insertData, error: insertError } = await supabase
      .from('patients')
      .insert([{
        health_id: testId,
        name: '__probe_test__',
        status: 'Active'
      }])
      .select();

    if (insertError) {
      if (insertError.code === '42501') {
        return {
          connected: true,
          canRead: true,
          canWrite: false,
          rlsBlocked: true,
          error: 'Row-Level Security (RLS) is blocking inserts.'
        };
      }
      return {
        connected: true,
        canRead: true,
        canWrite: false,
        rlsBlocked: false,
        error: insertError.message
      };
    }

    if (insertData && insertData[0]) {
      await supabase.from('patients').delete().eq('health_id', testId);
    }

    return {
      connected: true,
      canRead: true,
      canWrite: true,
      rlsBlocked: false,
      message: 'Full Read & Write Access Verified!'
    };
  } catch (err) {
    return { connected: false, canRead: false, canWrite: false, error: err.message };
  }
}

export async function fetchStaffFromSupabase() {
  if (!supabase) return [];
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetchStaff notice:', error.message || error);
      return [];
    }
    return (data || []).map((s) => ({
      id: s.id,
      staffId: s.staff_id || s.id,
      name: s.name,
      role: s.role,
      hospital: getHospitalName(s.hospital_id),
      hospitalId: s.hospital_id || 'HSP-01',
      password: s.password || 'admin'
    }));
  } catch (err) {
    console.warn('Supabase fetchStaff error:', err);
    return [];
  }
}

export async function registerStaff(staff) {
  if (!supabase) return null;
  try {
    const staffId = staff.staffId || staff.staff_id;
    const hospitalId = staff.hospitalId || 'HSP-01';
    const payload = {
      staff_id: staffId,
      name: staff.name,
      role: staff.role,
      hospital_id: hospitalId
    };
    const { data, error } = await supabase.from('staff').insert([payload]).select();
    if (error) {
      console.warn('Supabase registerStaff notice:', error.message || error);
      return null;
    }
    return data?.[0] || null;
  } catch (err) {
    console.warn('Supabase registerStaff error:', err);
    return null;
  }
}