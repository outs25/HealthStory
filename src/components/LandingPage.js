import React, { useState } from 'react';
import {
  Heart,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Activity,
  FileCheck2,
  Lock,
  Search,
  CheckCircle2
} from 'lucide-react';
import HealthIdCard from './shared/HealthIdCard';

export default function LandingPage({ onExplore, onOpenAuth, onSelectPatient, patients = [] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');

  const samplePatient = patients[0] || {
    id: "pat-1",
    healthId: "HS-2026-004821",
    name: "Arjun Sharma",
    age: 34,
    gender: "Male",
    bloodGroup: "O+",
    primaryHospital: "Apex National Medical Center",
    registeredAt: "2021-06-18"
  };

  const handleLookup = (e) => {
    e.preventDefault();
    setSearchError('');
    const clean = searchQuery.trim().toUpperCase();
    if (!clean) return;

    const found = patients.find(p => p.healthId.toUpperCase() === clean || p.name.toLowerCase().includes(clean.toLowerCase()));
    if (found) {
      setSearchResult(found);
    } else {
      setSearchError(`No verified patient found matching "${searchQuery}". Please check the Health ID.`);
      setSearchResult(null);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-canvas)', overflowX: 'hidden' }}>
      {/* 1. EDITORIAL HERO SECTION */}
      <section style={{ padding: '60px 24px 80px', maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(229,154,50,0.12) 0%, rgba(247,245,239,0) 70%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Top Product Badge */}
        <div style={{ textAlign: 'center', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
          <span
            className="badge badge-accent animate-fade-in"
            style={{ padding: '6px 16px', fontSize: '12px', letterSpacing: '0.06em' }}
          >
            <Sparkles size={14} color="var(--accent-dark)" />
            CENTRALIZED LONGITUDINAL HEALTH REGISTRY
          </span>
        </div>

        {/* Massive Editorial Headline */}
        <div style={{ textAlign: 'center', marginBottom: '32px', position: 'relative', zIndex: 1 }}>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(48px, 8.5vw, 110px)',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              lineHeight: 0.95,
              color: 'var(--text-primary)',
              textTransform: 'uppercase'
            }}
          >
            KNOW THE<br />
            <span style={{ color: 'var(--accent-primary)', position: 'relative' }}>
              WHOLE STORY.
              <span
                style={{
                  position: 'absolute',
                  bottom: '4px',
                  left: 0,
                  right: 0,
                  height: '8px',
                  backgroundColor: 'rgba(229, 154, 50, 0.25)',
                  borderRadius: '4px',
                  zIndex: -1
                }}
              />
            </span>
          </h1>

          <p
            style={{
              maxWidth: '720px',
              margin: '28px auto 0',
              fontSize: 'clamp(17px, 2vw, 21px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.55,
              fontWeight: 400
            }}
          >
            One verified, continuously updated health history — giving healthcare professionals the context they need when it matters most.
          </p>
        </div>

        {/* Hero CTA Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            flexWrap: 'wrap',
            marginBottom: '60px',
            position: 'relative',
            zIndex: 1
          }}
        >
          <button
            onClick={() => onExplore('patient')}
            className="btn btn-primary btn-lg"
            style={{ boxShadow: '0 8px 24px rgba(229,154,50,0.35)' }}
          >
            Explore HealthStory <ArrowRight size={18} />
          </button>
          <button
            onClick={() => onOpenAuth('admin')}
            className="btn btn-dark btn-lg"
          >
            <ShieldCheck size={18} /> Doctor & Staff Portal
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="btn btn-outline btn-lg"
          >
            How It Works
          </button>
        </div>

        {/* Hero Overlapping Visual Presentation with Floating Cards */}
        <div
          style={{
            position: 'relative',
            maxWidth: '1040px',
            margin: '0 auto',
            padding: '24px 0'
          }}
        >
          {/* Main Visual Centerpiece Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-floating)',
              padding: '36px',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Top Bar with Medical Metadata */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--accent-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent-dark)'
                  }}
                >
                  <Activity size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                    Arjun Sharma
                  </div>
                  <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--accent-dark)', fontWeight: 700 }}>
                    HS-2026-004821 • Blood: O+ • Age: 34
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-critical">
                  <AlertTriangle size={12} /> Allergy: Penicillin
                </span>
                <span className="badge badge-success">
                  <CheckCircle2 size={12} /> 18 Verified Records
                </span>
              </div>
            </div>

            {/* Timeline Stream Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              <div
                style={{
                  backgroundColor: 'var(--bg-card-accent)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-accent" style={{ fontSize: '10px' }}>2026 • ANNUAL CHECKUP</span>
                  <span style={{ fontSize: '11px', color: '#777' }}>18 Aug</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  Comprehensive Wellness & Metabolic Panel
                </h4>
                <p style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.45 }}>
                  Dr. Sarah Jenkins • Apex National Medical Center. Blood pressure 118/76. Fasting glucose 88 mg/dL.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card-accent)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '10px', backgroundColor: '#FEE2E2', color: '#B91C1C' }}>
                    2024 • SURGERY
                  </span>
                  <span style={{ fontSize: '11px', color: '#777' }}>14 Feb</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  Right Knee Arthroscopic Meniscectomy
                </h4>
                <p style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.45 }}>
                  Dr. Rajesh Mehra • City Care Institute. Non-penicillin prophylaxis utilized. Recovery full.
                </p>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--bg-card-accent)',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge badge-neutral" style={{ fontSize: '10px' }}>2022 • EMERGENCY</span>
                  <span style={{ fontSize: '11px', color: '#777' }}>12 Oct</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>
                  Appendectomy & Penicillin Hypersensitivity
                </h4>
                <p style={{ fontSize: '12.5px', color: '#555', lineHeight: 1.45 }}>
                  St. Jude Metropolitan Hospital. Critical adverse reaction documented and indexed permanently.
                </p>
              </div>
            </div>
          </div>

          {/* Floating UI Badges around Hero */}
          <div
            className="animate-float"
            style={{
              position: 'absolute',
              top: '-15px',
              left: '-25px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 3
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-dark)'
              }}
            >
              <Sparkles size={18} />
            </div>
            <div>
              <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#777', fontWeight: 700 }}>
                ✦ HEALTH HISTORY
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>
                12 Years Recorded
              </div>
            </div>
          </div>

          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '-20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '14px 20px',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid #FCD34D',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              zIndex: 3,
              animationDelay: '1.5s'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#FEF2F2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#D64545'
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <div style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#D64545', fontWeight: 800 }}>
                ⚠ CRITICAL ALLERGY
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#111' }}>
                Penicillin (Anaphylaxis)
              </div>
            </div>
          </div>

          <div
            className="animate-float"
            style={{
              position: 'absolute',
              bottom: '-25px',
              left: '60px',
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              padding: '10px 18px',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              zIndex: 3,
              animationDelay: '2.5s'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#333' }}>
              ● 27 Verified Records
            </span>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS (3-STEP CONNECTED LINE) */}
      <section
        id="how-it-works"
        style={{
          padding: '100px 24px',
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Section Heading */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span className="badge badge-accent" style={{ marginBottom: '14px' }}>
              CONTINUOUS CLINICAL CONTEXT
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(32px, 5vw, 56px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: 'var(--text-primary)',
                maxWidth: '850px',
                margin: '0 auto'
              }}
            >
              "Your health history shouldn't start over at every hospital."
            </h2>
            <p style={{ fontSize: '17px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '16px auto 0' }}>
              Instead of fragmented PDFs and forgotten prescriptions, HealthStory unifies every clinical encounter under one permanent, verified record.
            </p>
          </div>

          {/* 3 Step Connected Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              position: 'relative'
            }}
          >
            {/* Step 1 */}
            <div
              className="card card-hover"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-medium)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '44px',
                  fontWeight: 900,
                  color: 'var(--accent-primary)',
                  lineHeight: 1,
                  marginBottom: '16px'
                }}
              >
                01
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
                REGISTER
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Hospital staff registers the patient and creates their unique, permanent <strong>Health ID</strong> (e.g. <code>HS-2026-004821</code>) with baseline allergies and chronic baselines.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="card card-hover"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-medium)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '44px',
                  fontWeight: 900,
                  color: 'var(--accent-dark)',
                  lineHeight: 1,
                  marginBottom: '16px'
                }}
              >
                02
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
                RECORD
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Authorized hospital staff continuously update verified checkups, surgeries, imaging, diagnoses, and medication prescriptions with full cryptographic audit logging.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="card card-hover"
              style={{
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-medium)',
                position: 'relative'
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '44px',
                  fontWeight: 900,
                  color: 'var(--color-success)',
                  lineHeight: 1,
                  marginBottom: '16px'
                }}
              >
                03
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>
                REMEMBER
              </h3>
              <p style={{ fontSize: '14.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The patient and treating physicians access <strong>one continuous story</strong> anytime, anywhere — strictly read-only for patients and fully verified by clinical teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PATIENT HEALTH ID PREVIEW & SEARCH LOOKUP */}
      <section
        id="health-id-section"
        style={{
          padding: '90px 24px',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '48px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-accent" style={{ marginBottom: '12px' }}>
              UNIVERSAL IDENTIFIER
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                marginBottom: '18px'
              }}
            >
              One Health ID.<br />Every Medical Encounter.
            </h2>
            <p style={{ fontSize: '15.5px', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '24px' }}>
              Every registered patient receives an official Health ID linking their entire lifetime of medical events across participating hospitals, clinics, and surgical centers.
            </p>

            {/* Live Search Lookup Widget */}
            <form onSubmit={handleLookup} style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '14px' }} />
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter Universal Health ID or Patient Name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '42px' }}
                  />
                </div>
                <button type="submit" className="btn btn-dark">
                  Verify <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {searchError && (
              <div style={{ fontSize: '13px', color: 'var(--color-critical)', marginBottom: '14px' }}>
                {searchError}
              </div>
            )}

            {searchResult && (
              <div
                style={{
                  padding: '16px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #35A853',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '15px' }}>{searchResult.name}</strong>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#059669', fontWeight: 700 }}>
                      {searchResult.healthId} • {searchResult.bloodGroup}
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenAuth('patient', searchResult.healthId)}
                    className="btn btn-sm btn-primary"
                  >
                    Authenticate & View →
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '13px' }}>
              <Lock size={15} color="var(--accent-dark)" />
              <span>Cryptographically protected & tamper-evident.</span>
            </div>
          </div>

          {/* Interactive Visual Health ID Card */}
          <div>
            <HealthIdCard patient={searchResult || samplePatient} />
          </div>
        </div>
      </section>

      {/* 4. SECURITY & RBAC ASSURANCE */}
      <section
        style={{
          padding: '80px 24px',
          backgroundColor: '#18191B',
          color: '#FFFFFF'
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="badge badge-dark" style={{ marginBottom: '12px', borderColor: 'rgba(229,154,50,0.4)', color: 'var(--accent-soft)' }}>
              SECURITY & PERMISSIONS
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 900, color: '#FFFFFF' }}>
              Engineered for Absolute Medical Integrity.
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <ShieldCheck size={28} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Strict Role Separation
              </h3>
              <p style={{ fontSize: '13.5px', color: '#A0A0A5', lineHeight: 1.6 }}>
                Patients have strictly <strong>READ-ONLY</strong> access to their own medical timeline. Only credentialed hospital personnel can append records or document allergies.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <FileCheck2 size={28} color="#35A853" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                Immutable Audit Trail
              </h3>
              <p style={{ fontSize: '13.5px', color: '#A0A0A5', lineHeight: 1.6 }}>
                Every checkup recorded, allergy updated, and lab report uploaded is timestamped with the authorizing physician’s Staff ID and facility name.
              </p>
            </div>

            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Sparkles size={28} color="var(--accent-soft)" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '8px' }}>
                ✦ HealthStory AI Summary
              </h3>
              <p style={{ fontSize: '13.5px', color: '#A0A0A5', lineHeight: 1.6 }}>
                Organizational summaries synthesized strictly from verified clinical records on file—eliminating hallucinations, diagnostic overreach, or predictive guessing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer style={{ padding: '40px 24px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '13px', color: '#777' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Heart size={18} fill="var(--accent-primary)" color="var(--accent-primary)" />
          <strong style={{ color: '#111', fontSize: '15px' }}>HealthStory</strong>
        </div>
        <div>Every Record. One Health Story. • Centralized Longitudinal Patient Record Registry</div>
      </footer>
    </div>
  );
}
