Build a complete, production-quality full-stack web application called "HealthStory" — a centralized, verified longitudinal patient health-record platform.

IMPORTANT:
This is NOT a generic hospital management system.
This is NOT a patient-doctor appointment booking app.
The core purpose is to maintain one continuous, verified health history for every patient so that their medical information is organized and easily accessible to authorized healthcare staff when needed.

The platform has TWO primary interfaces with completely different permissions:

1. ADMINISTRATOR / HOSPITAL STAFF
   - Registers patients
   - Creates their health profile
   - Adds and updates verified medical information
   - Records checkups, surgeries, allergies, medications, diagnoses, hospitalizations, reports, etc.
   - Can edit existing records
   - Can search and manage patients

2. PATIENT / USER
   - Can ONLY VIEW their own health history
   - Cannot edit, delete, or add medical records
   - Can view their complete health timeline
   - Can view medical reports, surgeries, allergies, medications, diagnoses, checkups, etc.
   - Can see when and by whom records were updated
   - Can download/view their records

The entire application must use secure role-based access control on BOTH frontend and backend.

==================================================
1. DESIGN INSPIRATION
==================================================

Use the provided reference image as the visual inspiration.

The visual language should be:

- Premium
- Modern
- Editorial
- Minimal
- Human-centered
- Healthcare-tech
- Data-driven
- Warm
- Trustworthy

DO NOT make it look like a traditional hospital website.

Avoid:
- Generic blue medical dashboards
- Excessive tables
- Cluttered forms
- Too many medical icons
- Corporate SaaS appearance
- Excessive gradients
- Cheap-looking animations

Instead use:

- Warm off-white background
- Near-black typography
- Warm orange/amber accent
- Large oversized typography
- Rounded cards
- Subtle borders
- Generous whitespace
- Large numbers
- Editorial layouts
- Smooth animations
- Clean charts
- Beautiful timelines

Color palette:

Background:
#F7F5EF

Primary text:
#111111

Primary accent:
#E59A32

Soft accent:
#F1C27D

Success:
#35A853

Critical:
#D64545

Use red only for genuinely critical medical alerts.

Typography:
Use Inter, Manrope, Geist, or Plus Jakarta Sans.

Headings should be bold and oversized.

==================================================
2. BRANDING
==================================================

Product name:

HealthStory

Tagline:

"Every Record. One Health Story."

Alternative hero headline:

"KNOW THE
WHOLE STORY."

Supporting text:

"One verified, continuously updated health history — giving healthcare professionals the context they need when it matters most."

The central visual metaphor of the product is:

A patient's medical history is not a collection of disconnected documents.

It is ONE continuous story.

==================================================
3. LANDING PAGE
==================================================

Create a visually impressive landing page inspired by the supplied reference.

Hero section:

Use huge editorial typography.

Example:

KNOW THE
WHOLE STORY.

Place a rounded medical image/card inside or overlapping the typography.

The visual can show:
- Doctor reviewing patient history
- Patient record timeline
- Medical report
- Doctor and patient consultation

Add subtle floating UI cards around the hero.

Example floating card:

"✦ HEALTH HISTORY"

"12 Years Recorded"

Another:

"⚠ ALLERGY"

"Penicillin"

Another:

"● SURGERIES"

"3 Recorded"

Another:

"● MEDICAL RECORDS"

"27 Verified"

Hero CTA:

"Explore HealthStory →"

Secondary CTA:

"How It Works"

Add smooth scroll-based animations.

==================================================
4. HOW IT WORKS
==================================================

Create a simple 3-step section.

01
REGISTER

Hospital staff registers the patient and creates their unique Health ID.

02
RECORD

Authorized hospital staff continuously update verified medical information.

03
REMEMBER

The patient has one continuous health history that can be viewed whenever needed.

Visualize these steps with connected lines and animated cards.

Headline:

"Your health history shouldn't start over at every hospital."

==================================================
5. PATIENT HEALTH ID
==================================================

Every patient receives a unique Health ID.

Example:

HS-2026-004821

The Health ID connects all verified records belonging to that patient.

Create a visual Health ID card.

Example:

PATIENT HEALTH ID

HS-2026-004821

Patient:
Arjun Sharma

Registered:
12 March 2021

Status:
● Active

The Health ID should be unique and searchable by authorized administrators.

==================================================
6. ADMINISTRATOR LOGIN
==================================================

Create a separate administrator login.

Title:

"Hospital Staff Portal"

Fields:

Hospital ID / Staff ID
Password

Optional:

Hospital selection

After login, redirect to the Administrator Dashboard.

Patients must NEVER have access to administrator functionality.

==================================================
7. ADMINISTRATOR DASHBOARD
==================================================

Create a professional hospital-staff dashboard.

Header:

HealthStory
Hospital Staff Portal

Navigation:

Dashboard
Patients
Register Patient
Records
Recent Updates
Audit Log
Settings

Top statistics:

TOTAL PATIENTS
1,248

TODAY'S CHECKUPS
86

SURGERIES RECORDED
12

RECENT UPDATES
34

Use animated counters when the dashboard loads.

==================================================
8. ADMIN PATIENT SEARCH
==================================================

Create a prominent search bar:

"Search patient by name, Health ID, phone number..."

Results should show:

Patient name
Health ID
Age
Last updated
Status

Example:

Arjun Sharma
HS-2026-004821
34 years
Updated today
● Active

Button:

"Open Record →"

The administrator should be able to quickly locate a patient.

==================================================
9. REGISTER NEW PATIENT
==================================================

Create a clean multi-step registration form.

STEP 1 — BASIC INFORMATION

Full Name
Date of Birth
Gender
Phone Number
Address
Emergency Contact

STEP 2 — MEDICAL INFORMATION

Blood Group
Known Allergies
Existing Conditions
Current Medications

STEP 3 — CONFIRMATION

Review information.

Generate unique Health ID.

Example:

"Patient successfully registered."

Health ID:
HS-2026-004821

Button:

"Open Patient Record →"

Make this process visually smooth and easy for hospital staff.

==================================================
10. ADMIN PATIENT PROFILE
==================================================

When an administrator opens a patient:

Header:

PATIENT RECORD

Arjun Sharma
HS-2026-004821

34 years • Male

Last Updated:
02 September 2026

Then display:

CRITICAL INFORMATION

Blood Group:
O+

Allergies:
Penicillin

Active Conditions:
2

Current Medications:
3

Previous Surgeries:
2

Critical alerts must be immediately visible.

==================================================
11. ADMIN HEALTH TIMELINE
==================================================

This is the CORE feature of the entire application.

Create a beautiful chronological medical timeline.

Title:

"Complete Health Story"

Example:

2026

● 18 Aug
Annual Health Check

Blood test
General examination
Doctor consultation

● 04 Aug
Hospital Visit

Diagnosis recorded
Prescription updated

2024

● 12 Mar
Surgical Procedure

Procedure:
Appendectomy

Hospital:
XYZ Hospital

Outcome:
Recovery completed

2021

● 18 Jun
Patient Registered

HealthStory ID created

Each timeline event should be clickable.

When clicked, expand the event smoothly.

Show:

Date
Hospital
Doctor / Staff
Event type
Diagnosis
Procedure
Medications
Reports
Notes
Outcome

==================================================
12. ADMIN ADD HEALTH RECORD
==================================================

Create a large:

"+ Add Health Record"

button.

Clicking opens record type selection:

CHECKUP
SURGERY
DIAGNOSIS
ALLERGY
MEDICATION
LAB REPORT
IMAGING
HOSPITALIZATION
VACCINATION
OTHER

For example, SURGERY:

Procedure Name
Date
Hospital
Doctor
Reason
Notes
Outcome
Supporting Documents

After saving:

"Record added successfully"

The new record should animate into the patient's timeline.

==================================================
13. ADMIN ALLERGY MANAGEMENT
==================================================

Create a highly visible section:

CRITICAL ALLERGIES

Example:

⚠ PENICILLIN

Documented:
12 March 2024

Notes:
Previous adverse reaction

Source:
Hospital Record

Administrators can add or update allergy information.

Every modification must be recorded in the audit log.

==================================================
14. ADMIN MEDICATION HISTORY
==================================================

Show medications chronologically.

CURRENT

Medication A
500 mg
Twice daily
Started:
2026

PREVIOUS

Medication B
250 mg
2024–2025

Clearly differentiate:

Active
Discontinued
Previous

==================================================
15. ADMIN MEDICAL DOCUMENTS
==================================================

Create a document library.

Categories:

Lab Reports
Prescriptions
Imaging
Discharge Summaries
Consultation Notes
Other Documents

Each document:

Document Name
Date
Hospital
Uploaded By

Buttons:

View
Download

Allow authorized administrators to upload documents.

==================================================
16. ADMIN AUDIT LOG
==================================================

Create an important audit trail.

Title:

"Record Activity"

Example:

02 Sep 2026
3:42 PM

Blood Group Updated

Updated by:
Staff ID #HSP482

----------------

02 Sep 2026
2:18 PM

New Checkup Added

Added by:
Staff ID #HSP291

----------------

01 Sep 2026
11:02 AM

Lab Report Uploaded

Uploaded by:
Staff ID #HSP482

Every medical record modification should have:

Timestamp
Staff ID
Action
Record affected

Do not allow administrators to silently modify history.

==================================================
17. PATIENT LOGIN
==================================================

Create a separate patient login.

Title:

"Your HealthStory"

Login options can include:

Health ID
Password / secure authentication

After login, redirect to the Patient Dashboard.

Patients must only be able to access THEIR OWN record.

==================================================
18. PATIENT DASHBOARD
==================================================

The patient interface should be significantly simpler and more personal than the administrator interface.

Hero:

"Your Health Story"

Supporting:

"Everything you've ever needed to know about your health, in one place."

Show:

Patient Name
Health ID
Last Updated

Then:

YOUR HEALTH AT A GLANCE

Blood Group
O+

Allergies
2

Medications
3

Medical Events
18

These are informational cards, not medical diagnoses or "health scores."

==================================================
19. PATIENT CRITICAL INFORMATION
==================================================

Create a prominent card:

IMPORTANT HEALTH INFORMATION

Blood Group:
O+

Known Allergies:
Penicillin

Current Conditions:
2 documented

Current Medications:
3 active

Use strong visual hierarchy.

The patient cannot edit these values.

Instead show:

"Information is maintained by authorized healthcare staff."

==================================================
20. PATIENT HEALTH JOURNEY
==================================================

Make this the most beautiful section of the patient interface.

Title:

"Your Health Journey"

Show a chronological timeline.

Example:

2026
● Annual Health Check

18 Aug 2026

Blood test
General examination

2024
● Surgery

12 Mar 2024

Appendectomy
Recovery completed

2021
● Registration

18 Jun 2021

HealthStory profile created

Patients can click events to VIEW details.

There should be:

NO EDIT BUTTON
NO DELETE BUTTON
NO ADD RECORD BUTTON

The interface is strictly read-only.

==================================================
21. PATIENT RECORD VIEW
==================================================

When the patient opens a record:

Blood Test

18 August 2026

Hospital:
XYZ Hospital

Recorded by:
Authorized Hospital Staff

Results:
View Report

Notes:
...

Display a clear label:

✓ Verified Hospital Record

==================================================
22. PATIENT MEDICAL DOCUMENTS
==================================================

Patient can view:

Lab Reports
Prescriptions
Imaging
Discharge Summaries
Medical Certificates

They can:

View
Download

They cannot:

Edit
Replace
Delete

==================================================
23. PATIENT RECORD HISTORY
==================================================

Allow patients to see when their information was updated.

Example:

"Your allergy information was updated"

02 September 2026
By authorized hospital staff

This creates transparency and trust.

==================================================
24. ROLE-BASED ACCESS CONTROL
==================================================

Implement proper RBAC.

ADMIN:

CREATE
READ
UPDATE

PATIENT:

READ ONLY

Backend MUST enforce this.

Do NOT rely only on hiding frontend buttons.

Example:

POST /patients/:id/records

ADMIN → allowed

PATIENT → 403 Forbidden

Patients must never be able to modify medical information by manually calling API endpoints.

Also ensure a patient cannot access another patient's records by changing a URL or patient ID.

==================================================
25. SEARCH
==================================================

Administrator:

Search all registered patients.

Patient:

Search ONLY within their own health history.

Patient search examples:

"surgeries"
"blood tests"
"medications"
"allergies"

Administrator search examples:

"HS-2026-004821"
"Arjun Sharma"
"patients updated today"

==================================================
26. OPTIONAL AI HEALTH SUMMARY
==================================================

Add a subtle AI-assisted feature called:

"✦ HealthStory Summary"

For authorized staff, generate a concise summary from EXISTING verified records.

Example:

PATIENT HISTORY SUMMARY

"Patient has 12 years of recorded medical history.

2 previous surgeries are documented.
1 medication allergy is recorded.
3 medications are currently active.
Most recent health check was recorded on 18 Aug 2026."

Every statement must link to its supporting record.

The AI must NOT:

- Diagnose
- Prescribe
- Predict medical outcomes
- Recommend treatment
- Invent missing information

If information is unavailable:

"No documented information found."

The AI is an organizational and summarization tool, NOT a doctor.

==================================================
27. ANIMATION SYSTEM
==================================================

Make the website highly attractive with premium animations.

Use smooth motion inspired by modern editorial websites.

Hero:

- Oversized typography slides upward
- Embedded image scales from 0.85 → 1
- Floating cards gently move
- CTA fades in
- Subtle cursor-based parallax on desktop

Dashboard:

- Cards stagger into view
- Numbers count upward
- Charts draw themselves
- Timeline progressively appears

Timeline:

- Connecting line grows as it enters viewport
- Events fade/slide into position
- Selected event expands smoothly

AI:

"✦ Reviewing records..."

Subtle animated dots.

Then:

"✦ Summary Ready"

Record upload:

Uploading
↓
Processing
↓
Review
↓
Saved to Health Journey

Buttons:

- Subtle hover movement
- Arrow shifts right
- Slight scale on click

Cards:

- Lift approximately 4px
- Subtle shadow
- Smooth transition

Do not over-animate medical information.

Support:

prefers-reduced-motion

==================================================
28. PATIENT VS ADMIN VISUAL DIFFERENCE
==================================================

ADMIN:

More structured.
More information-dense.
Efficient.
Professional.
Designed for rapid data entry and patient management.

PATIENT:

More spacious.
Personal.
Visual.
Story-driven.
Designed for understanding.

Do not make both interfaces identical.

==================================================
29. RESPONSIVE DESIGN
==================================================

Desktop:

Use large editorial layouts.

Tablet:

Two-column responsive layouts.

Mobile:

Prioritize:

1. Critical information
2. Latest health event
3. Health timeline
4. Medications
5. Documents

Patient mobile navigation:

Home
Health Journey
Records
Profile

Administrator mobile navigation:

Dashboard
Patients
Add Record
Activity
Profile

==================================================
30. ACCESSIBILITY
==================================================

Follow accessible design principles.

- WCAG-friendly contrast
- Keyboard navigation
- Screen-reader labels
- Large touch targets
- Clear error states
- No color-only indicators
- Readable typography
- Reduced-motion support

==================================================
31. SECURITY & PRIVACY
==================================================

Because this application contains sensitive medical information:

Implement:

- Secure authentication
- Password hashing
- Role-based authorization
- Patient-specific access control
- Protected API routes
- Audit logs
- Secure document access
- Session management
- Input validation
- Backend authorization
- No exposure of medical information in public URLs

Show subtle trust indicators:

"🔒 Your health records are protected."

"✓ Verified hospital record"

==================================================
32. DATABASE STRUCTURE
==================================================

Design the backend around entities such as:

User
Patient
Hospital
Staff
HealthRecord
MedicalEvent
Allergy
Medication
Diagnosis
Surgery
Checkup
Document
AuditLog

Patient:

id
healthId
name
dateOfBirth
gender
bloodGroup
contact
emergencyContact
createdAt
updatedAt

HealthRecord:

id
patientId
type
date
hospitalId
createdBy
title
description
metadata
documentUrl
createdAt
updatedAt

AuditLog:

id
patientId
staffId
action
recordId
timestamp
details

Use relationships between these entities rather than storing everything as one large text field.

==================================================
33. SAMPLE DATA
==================================================

Populate the prototype with realistic DEMO data.

Do not use real people's medical information.

Example:

Patient:
Arjun Sharma

Health ID:
HS-2026-004821

Age:
34

Blood Group:
O+

Allergy:
Penicillin

Previous Surgery:
Appendectomy — 2022

Current Medication:
3 medications

Health Events:
18+

Create several timeline events so the UI feels populated.

==================================================
34. EMPTY STATES
==================================================

Patient:

"No health records have been added yet."

"Your health story starts here."

Admin:

"No patients found."

"No recent updates."

"No documents uploaded."

Make empty states visually attractive.

==================================================
35. FINAL EXPERIENCE
==================================================

The final product should feel like:

A patient's entire medical history transformed into one clear, continuously updated story.

The most important visual and functional concept should be:

PATIENT
↓
HEALTH ID
↓
VERIFIED RECORDS
↓
CONTINUOUS TIMELINE
↓
COMPLETE HEALTH STORY

The key message of the website is:

"Your health history shouldn't start over every time you visit a hospital."

And the core product statement is:

"Every record. One Health Story."

Build the application with polished UI, responsive layouts, realistic interactions, proper role-based permissions, smooth animations, clean component architecture, and a functional frontend/backend structure.

Prioritize the Health Timeline, Critical Information, Patient Health ID, Administrator Record Management, and strict Patient Read-Only experience above secondary features.