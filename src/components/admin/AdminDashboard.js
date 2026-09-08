import React, { useState, useEffect } from 'react';
import {
  Users,
  CalendarCheck,
  Scissors,
  Activity,
  UserPlus,
  Search,
  AlertTriangle,
  Clock
} from 'lucide-react';

export default function AdminDashboard({
  currentStaff,
  patients = [],
  records = [],
  auditLogs = [],
  onSelectPatient,
  onOpenRegister,
  onOpenAddRecord,
  onViewPatients,
  onViewDocument
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [counters, setCounters] = useState({
    patients: 0,
    checkups: 0,
    surgeries: 0,
    updates: 0
  });

  // Animated counters on mount
  useEffect(() => {
    const targetPatients = patients.length;
    const targetCheckups = records.filter(r => r.type === 'CHECKUP').length;
    const targetSurgeries = records.filter(r => r.type === 'SURGERY').length;
    const targetUpdates = auditLogs.length;

    let start = 0;
    const duration = 800;
    const stepTime = 20;
    const steps = duration / stepTime;

    const interval = setInterval(() => {
      start++;
      const progress = start / steps;
      setCounters({
        patients: Math.floor(targetPatients * progress),
        checkups: Math.floor(targetCheckups * progress),
        surgeries: Math.floor(targetSurgeries * progress),
        updates: Math.floor(targetUpdates * progress)
      });

      if (start >= steps) {
        clearInterval(interval);
        setCounters({
          patients: targetPatients,
          checkups: targetCheckups,
          surgeries: targetSurgeries,
          updates: targetUpdates
        });
      }
    }, stepTime);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patients.length, records.length, auditLogs.length]);

  // Filtered patients based on search
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.healthId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Dashboard Top Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '32px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-accent">AUTHORIZED HOSPITAL STAFF PORTAL</span>
            <span style={{ fontSize: '12px', color: '#666' }}>Facility: {currentStaff?.hospital}</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Clinical Operations & Patient Registry
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Welcome, <strong>{currentStaff?.name}</strong> ({currentStaff?.role}). Managing verified longitudinal patient health stories.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button onClick={onOpenRegister} className="btn btn-primary">
            <UserPlus size={16} /> Register New Patient
          </button>
        </div>
      </div>

      {/* Top Statistics Counters Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}
      >
        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              TOTAL PATIENTS
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#111' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#111' }}>
            {counters.patients.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
            ● Active in longitudinal registry
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              TODAY'S CHECKUPS
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-dark)' }}>
              <CalendarCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--accent-dark)' }}>
            {counters.checkups}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Verified across outpatient departments
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              SURGERIES RECORDED
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
              <Scissors size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#DC2626' }}>
            {counters.surgeries}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Operative notes & post-op files
          </div>
        </div>

        <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', fontWeight: 700 }}>
              RECENT UPDATES
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
              <Activity size={18} />
            </div>
          </div>
          <div style={{ fontSize: '36px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#2563EB' }}>
            {counters.updates}
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Tamper-evident audit logs logged
          </div>
        </div>
      </div>

      {/* Main Grid: Patient Search & Recent Registry (Left) + Critical Alerts & Audit Stream (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
        {/* Left Column: Fast Patient Search & Quick Select */}
        <div>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Admin Patient Search</h3>
              <button onClick={onViewPatients} className="btn btn-sm btn-outline">
                View All Directory →
              </button>
            </div>

            {/* Prominent Search Bar */}
            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <Search size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                className="form-input"
                placeholder="Search patient by name, Health ID, phone number..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '42px', fontSize: '14px' }}
              />
            </div>

            {/* Patient Results List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filteredPatients.length === 0 ? (
                <div style={{ padding: '36px 20px', textAlign: 'center', color: '#777', backgroundColor: 'var(--bg-canvas)', borderRadius: '12px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                    {patients.length === 0 ? "No patients registered yet" : `No patients match "${searchQuery}"`}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '14px' }}>
                    {patients.length === 0 ? "Start by registering your first patient to generate their unique Health ID." : "Try adjusting your search terms or verify the Health ID."}
                  </div>
                  {patients.length === 0 && (
                    <button onClick={onOpenRegister} className="btn btn-sm btn-primary">
                      <UserPlus size={14} /> Register First Patient
                    </button>
                  )}
                </div>
              ) : (
                filteredPatients.slice(0, 5).map(p => (
                  <div
                    key={p.id}
                    onClick={() => onSelectPatient(p)}
                    className="card-hover"
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-canvas)',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '15px', color: '#111' }}>{p.name}</strong>
                        <span style={{ fontSize: '12px', color: '#666' }}>({p.age} yrs • {p.gender})</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '12px' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-dark)' }}>
                          {p.healthId}
                        </span>
                        <span style={{ color: '#777' }}>•</span>
                        <span style={{ color: '#D64545', fontWeight: 600 }}>Blood: {p.bloodGroup}</span>
                        <span style={{ color: '#777' }}>•</span>
                        <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                          {p.status}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPatient(p);
                      }}
                      className="btn btn-sm btn-dark"
                    >
                      Open Record →
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Critical Alerts Feed & Recent Audit Trail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Critical Allergy & High-Risk Alert Notice */}
          <div
            style={{
              backgroundColor: '#FEF2F2',
              borderRadius: '20px',
              border: '1px solid #FECACA',
              padding: '22px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <AlertTriangle size={18} color="#DC2626" />
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#991B1B', margin: 0 }}>
                CRITICAL ALLERGY FLAGS (HIGH-RISK CONTRAINDICATIONS)
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {patients.flatMap(p => (p.allergies || []).filter(a => a.severity === 'Critical').map(a => ({ ...a, patient: p }))).length === 0 ? (
                <div style={{ fontSize: '13px', color: '#7F1D1D', padding: '10px 14px', backgroundColor: '#FFFFFF', borderRadius: '10px', border: '1px solid #FCA5A5' }}>
                  No active critical allergy contraindications documented.
                </div>
              ) : (
                patients
                  .flatMap(p => (p.allergies || []).filter(a => a.severity === 'Critical').map(a => ({ ...a, patient: p })))
                  .slice(0, 3)
                  .map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => onSelectPatient(item.patient)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '10px 14px',
                        border: '1px solid #FCA5A5',
                        fontSize: '12.5px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <strong style={{ color: '#B91C1C' }}>⚠ {item.allergen.toUpperCase()}</strong> —{' '}
                        <span style={{ fontWeight: 600, color: '#111' }}>{item.patient.name}</span>{' '}
                        <span style={{ fontFamily: 'monospace', color: '#666', fontSize: '11px' }}>({item.patient.healthId})</span>
                        <div style={{ fontSize: '11px', color: '#777', marginTop: '2px' }}>
                          Reaction: {item.reaction}
                        </div>
                      </div>
                      <span className="badge badge-critical" style={{ fontSize: '10px' }}>Critical</span>
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Record Activity / Audit Trail Preview */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="var(--accent-dark)" />
                <h3 style={{ fontSize: '17px', fontWeight: 800 }}>Recent Record Activity (Audit Trail)</h3>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>Tamper-Evident</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontSize: '13px', backgroundColor: 'var(--bg-canvas)', borderRadius: '10px' }}>
                  No recent audit activity. Records created by hospital staff will be logged here.
                </div>
              ) : (
                auditLogs.slice(0, 4).map((log, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <strong style={{ color: '#111' }}>{log.action}</strong>
                      <span style={{ fontSize: '11px', color: '#888' }}>
                        {new Date(log.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div style={{ color: '#555', marginTop: '2px' }}>
                      Patient: <strong>{log.patientName}</strong> ({log.healthId})
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#777', marginTop: '4px' }}>
                      Staff ID: <code>{log.staffId}</code> • {log.hospital}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
