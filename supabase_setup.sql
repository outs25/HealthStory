-- =========================================================
-- HealthStory — Complete Supabase Database Setup & RLS Script
-- =========================================================
-- Run this in your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Ensure all HealthStory tables exist with primary keys and foreign keys
CREATE TABLE IF NOT EXISTS public.hospitals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    city TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.staff (
    id TEXT PRIMARY KEY,
    staff_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.patients (
    id TEXT PRIMARY KEY,
    health_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    date_of_birth DATE,
    gender TEXT,
    blood_group TEXT,
    phone TEXT,
    email TEXT,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_relation TEXT,
    emergency_contact_phone TEXT,
    primary_hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'Active',
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by_staff_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.health_records (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
    doctor TEXT,
    staff_id TEXT,
    department TEXT,
    description TEXT,
    vitals JSONB,
    diagnosis TEXT,
    procedure TEXT,
    medications JSONB,
    notes TEXT,
    outcome TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.documents (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    category TEXT,
    hospital_id TEXT REFERENCES public.hospitals(id) ON DELETE SET NULL,
    uploaded_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE SET NULL,
    health_id TEXT,
    patient_name TEXT,
    staff_id TEXT,
    staff_name TEXT,
    hospital_id TEXT,
    action TEXT NOT NULL,
    record_type TEXT,
    record_title TEXT,
    details TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.allergies (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    allergen TEXT NOT NULL,
    category TEXT DEFAULT 'Medication',
    severity TEXT DEFAULT 'Critical',
    reaction TEXT,
    documented_date DATE DEFAULT CURRENT_DATE,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.medications (
    id TEXT PRIMARY KEY,
    patient_id TEXT REFERENCES public.patients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    dosage TEXT,
    frequency TEXT,
    status TEXT DEFAULT 'Active',
    start_date DATE DEFAULT CURRENT_DATE,
    reason TEXT,
    prescribed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Seed Default Hospitals and Staff
INSERT INTO public.hospitals (id, name, city) VALUES
    ('HSP-01', 'Apex National Medical Center', 'Seattle, WA'),
    ('HSP-02', 'St. Jude Metropolitan Hospital', 'San Francisco, CA'),
    ('HSP-03', 'City Care Specialty Institute', 'Boston, MA')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, city = EXCLUDED.city;

INSERT INTO public.staff (id, staff_id, name, role, hospital_id) VALUES
    ('staff-1', 'HSP-482', 'Dr. Sarah Jenkins', 'Chief of Internal Medicine', 'HSP-01'),
    ('staff-2', 'HSP-291', 'Dr. Rajesh Mehra', 'Consultant Surgeon', 'HSP-03'),
    ('staff-3', 'HSP-108', 'Elena Gomez, RN', 'Lead Clinical Coordinator & Registrar', 'HSP-01')
ON CONFLICT (staff_id) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role, hospital_id = EXCLUDED.hospital_id;

-- 3. Configure Row-Level Security (RLS) Permissions for Web App Client
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allergies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;

-- Drop any existing conflicting policies
DROP POLICY IF EXISTS "Allow anon all on hospitals" ON public.hospitals;
DROP POLICY IF EXISTS "Allow anon all on staff" ON public.staff;
DROP POLICY IF EXISTS "Allow anon all on patients" ON public.patients;
DROP POLICY IF EXISTS "Allow anon all on health_records" ON public.health_records;
DROP POLICY IF EXISTS "Allow anon all on documents" ON public.documents;
DROP POLICY IF EXISTS "Allow anon all on audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Allow anon all on allergies" ON public.allergies;
DROP POLICY IF EXISTS "Allow anon all on medications" ON public.medications;

-- Create Open Access Policies for Application Web Client
CREATE POLICY "Allow anon all on hospitals" ON public.hospitals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on staff" ON public.staff FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on patients" ON public.patients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on health_records" ON public.health_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on documents" ON public.documents FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on allergies" ON public.allergies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon all on medications" ON public.medications FOR ALL USING (true) WITH CHECK (true);
