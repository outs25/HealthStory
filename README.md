🏥 HealthStory

A Centralized, Verified Longitudinal Patient Health Record Platform

HealthStory is a full-stack web application designed to maintain a patient's continuous, organized, and verified health history in one place.

Instead of keeping medical information scattered across different hospitals, reports, and paper records, HealthStory creates a centralized digital health timeline that authorized healthcare staff can update and patients can securely view.

---

🎯 Problem

Patient medical information is often distributed across:

- Different hospitals and clinics
- Paper-based medical records
- Lab reports
- Prescriptions
- Previous surgeries and treatments
- Different doctors and healthcare providers

This makes it difficult for healthcare professionals to quickly understand a patient's complete medical history.

HealthStory solves this by providing:

«One patient → One continuous → Verified health story»

---

💡 Our Solution

HealthStory provides a centralized platform where authorized hospital staff can create and maintain verified patient records.

The system organizes important medical information into a structured timeline, allowing healthcare professionals to understand a patient's history more efficiently.

Patients can also access their own records without having permission to modify the verified information.

---

👥 User Roles

👨‍⚕️ Admin / Hospital Staff

Authorized staff can:

- Register new patients
- Generate unique Health IDs
- Create patient profiles
- Add medical information
- Record diagnoses
- Add allergies
- Record medications
- Add checkups
- Record surgeries
- Add hospitalizations
- Upload/view medical reports
- Update existing information
- Search and manage patient records
- Track who updated information

👤 Patient

Patients have read-only access to their own health history.

They can:

- View their Health ID
- View their medical timeline
- View diagnoses
- View allergies
- View medications
- View surgeries
- View checkups
- View hospitalizations
- View medical reports
- See record/update information

Patients cannot modify or delete verified medical records.

---

✨ Key Features

🆔 Unique Health ID

Every registered patient receives a unique Health ID that can be used to identify their centralized health record.

📜 Longitudinal Health Timeline

Medical events are organized chronologically to create a continuous health story.

🏥 Centralized Patient Records

Important medical information is maintained in one structured profile.

🔐 Role-Based Access

Different permissions are provided to hospital staff and patients.

💊 Medical Information Management

Records can include:

- Diagnoses
- Allergies
- Medications
- Surgeries
- Checkups
- Hospitalizations
- Medical reports

🔎 Patient Search

Authorized staff can search and manage registered patients.

📝 Record Tracking

The platform can display information about when records were updated and by whom.

📱 Responsive Interface

Designed to work across desktop and mobile screen sizes.

---

🏗️ System Architecture

                    ┌─────────────────────┐
                    │      HealthStory    │
                    │    Web Application  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
        ┌───────▼────────┐           ┌────────▼───────┐
        │ Hospital Staff │           │     Patient     │
        │     / Admin    │           │      / User     │
        └───────┬────────┘           └────────┬────────┘
                │                             │
                │ Create / Update             │ View Only
                │                             │
                └──────────────┬──────────────┘
                               │
                       ┌───────▼────────┐
                       │     Supabase   │
                       │ Authentication │
                       │  + PostgreSQL  │
                       └───────┬────────┘
                               │
                       ┌───────▼────────┐
                       │ Patient Health │
                       │    Records     │
                       └────────────────┘

---

🛠️ Tech Stack

Frontend

- React.js
- JavaScript
- HTML5
- CSS3

Backend / Database

- Supabase
- PostgreSQL
- Supabase Authentication

Deployment

- Vercel
- GitHub

---

📂 Project Structure

HealthStory/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── AuthModal.js
│   │   ├── RegisterPatientModal.js
│   │   └── ...
│   │
│   ├── lib/
│   │   └── supabaseClient.js
│   │
│   ├── App.js
│   ├── index.js
│   └── ...
│
├── package.json
├── README.md
└── ...

---

🚀 Getting Started

1. Clone the Repository

git clone https://github.com/outs25/HealthStory.git

2. Navigate to the Project

cd HealthStory

3. Install Dependencies

npm install

4. Configure Supabase

Create a Supabase project and configure the required environment variables.

Create a ".env" file in the project root:

REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

⚠️ Never commit your ".env" file or private credentials to GitHub.

5. Start the Development Server

npm start

The application should open at:

http://localhost:3000

---

🌐 Live Application

You can access the deployed version here:

https://health-story-ten.vercel.app/

---

🔐 Security & Access Control

HealthStory is designed around the principle that medical information should only be accessible to authorized users.

The platform separates permissions between:

Role| Access
Admin / Hospital Staff| Create, update and manage patient records
Patient| View own records
Unauthorized User| No access to protected records

The backend should enforce authorization rules rather than relying only on frontend restrictions.

---

🔄 Application Workflow

Hospital Staff
      │
      ▼
Register Patient
      │
      ▼
Generate Health ID
      │
      ▼
Create Patient Profile
      │
      ▼
Add Verified Medical Information
      │
      ▼
Store in Database
      │
      ▼
Patient Health Timeline
      │
      ▼
Patient Views Personal History

---

📊 Example Patient Record

A patient's HealthStory can contain:

Patient Profile
│
├── Health ID
│
├── Personal Information
│
├── Allergies
│
├── Diagnoses
│
├── Medications
│
├── Checkups
│
├── Surgeries
│
├── Hospitalizations
│
└── Medical Reports

---

🎯 Future Enhancements

Planned improvements can include:

- 📄 Secure medical document storage
- 📱 Mobile application
- 🔔 Important health notifications
- 📊 Medical history analytics
- 🤖 AI-assisted medical record summarization
- 🔗 Inter-hospital record sharing
- 🧾 Digital prescriptions
- 📈 Patient health trends
- 🔐 Advanced audit logs
- 🪪 QR-based Health ID access
- ☁️ Scalable cloud infrastructure

---

🌍 Vision

HealthStory aims to move healthcare records from scattered information to a continuous health story.

The goal is simple:

«When a healthcare professional needs to understand a patient's history, the important information should already be there.»

---

👨‍💻 Developer

Outs25

GitHub:
https://github.com/outs25

---

📄 License

This project is currently intended for educational, academic, and demonstration purposes.

If you plan to use HealthStory with real patient data, additional security, privacy, compliance, auditing, and infrastructure requirements must be addressed before production use.

---

⭐ If you find HealthStory interesting, consider giving the repository a star!