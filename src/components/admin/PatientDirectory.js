import React, { useState } from 'react';
import { Search, UserPlus, AlertTriangle } from 'lucide-react';

export default function PatientDirectory({
  patients = [],
  onSelectPatient,
  onOpenRegister
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'critical', 'medications', 'surgeries'

  const filteredPatients = patients.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.healthId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery) ||
      p.bloodGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.conditions || []).some(c => c.condition.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filter === 'critical') {
      return (p.allergies || []).some(a => a.severity === 'Critical');
    }
    if (filter === 'medications') {
      return (p.medications || []).some(m => m.status === 'Active');
    }
    if (filter === 'surgeries') {
      return p.surgeriesCount > 0;
    }
    return true;
  });

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Directory Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="badge badge-accent">ADMINISTRATOR DIRECTORY</span>
            <span style={{ fontSize: '12px', color: '#666' }}>{patients.length} Registered Patients</span>
          </div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em' }}>
            Patient Longitudinal Records
          </h1>
        </div>

        <button onClick={onOpenRegister} className="btn btn-primary">
          <UserPlus size={16} /> Register New Patient
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={18} color="#888" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Search patient by name, Health ID, phone number, blood group, or condition..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter('all')}
            className={`btn btn-sm ${filter === 'all' ? 'btn-dark' : 'btn-outline'}`}
          >
            All Patients ({patients.length})
          </button>
          <button
            onClick={() => setFilter('critical')}
            className={`btn btn-sm ${filter === 'critical' ? 'btn-dark' : 'btn-outline'}`}
            style={{ color: filter === 'critical' ? '#FFF' : '#B91C1C' }}
          >
            <AlertTriangle size={13} /> Critical Allergies (
            {patients.filter(p => (p.allergies || []).some(a => a.severity === 'Critical')).length}
            )
          </button>
          <button
            onClick={() => setFilter('medications')}
            className={`btn btn-sm ${filter === 'medications' ? 'btn-dark' : 'btn-outline'}`}
          >
            Active Medications
          </button>
          <button
            onClick={() => setFilter('surgeries')}
            className={`btn btn-sm ${filter === 'surgeries' ? 'btn-dark' : 'btn-outline'}`}
          >
            Previous Surgeries
          </button>
        </div>
      </div>

      {/* Patients Grid Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredPatients.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px 24px', textAlign: 'center', backgroundColor: '#FFF', borderRadius: '16px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: 'var(--accent-light)', color: 'var(--accent-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <UserPlus size={24} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111', marginBottom: '6px' }}>
              {patients.length === 0 ? "No patients in registry yet" : "No patients found"}
            </h3>
            <p style={{ fontSize: '13.5px', color: '#666', maxWidth: '440px', margin: '0 auto 16px' }}>
              {patients.length === 0 ? "Register your first patient to generate their universal Health ID and start their continuous medical story." : "Try adjusting your search terms or filter selection."}
            </p>
            {patients.length === 0 && (
              <button onClick={onOpenRegister} className="btn btn-primary btn-sm">
                <UserPlus size={14} /> Register First Patient
              </button>
            )}
          </div>
        ) : (
          filteredPatients.map(p => {
            const hasCritical = (p.allergies || []).some(a => a.severity === 'Critical');
            return (
              <div
                key={p.id}
                className="card card-hover"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: hasCritical ? '1px solid #FCA5A5' : '1px solid var(--border-subtle)',
                  position: 'relative'
                }}
              >
                {hasCritical && (
                  <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                    <span className="badge badge-critical" style={{ fontSize: '10px' }}>
                      <AlertTriangle size={11} /> Critical Alert
                    </span>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--accent-light)',
                      color: 'var(--accent-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: 800
                    }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>{p.name}</h3>
                    <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--accent-dark)', fontWeight: 700 }}>
                      {p.healthId}
                    </div>
                  </div>
                </div>

                {/* Patient Quick Stats Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '8px',
                    padding: '12px',
                    backgroundColor: 'var(--bg-canvas)',
                    borderRadius: '10px',
                    marginBottom: '16px',
                    fontSize: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div>
                    <div style={{ color: '#777', fontSize: '10.5px', textTransform: 'uppercase' }}>Blood</div>
                    <strong style={{ color: '#D64545', fontSize: '13px' }}>{p.bloodGroup}</strong>
                  </div>
                  <div>
                    <div style={{ color: '#777', fontSize: '10.5px', textTransform: 'uppercase' }}>Age / Sex</div>
                    <strong style={{ color: '#111', fontSize: '13px' }}>{p.age} / {p.gender.charAt(0)}</strong>
                  </div>
                  <div>
                    <div style={{ color: '#777', fontSize: '10.5px', textTransform: 'uppercase' }}>Records</div>
                    <strong style={{ color: '#059669', fontSize: '13px' }}>{p.totalRecordsCount || 1} verified</strong>
                  </div>
                </div>

                {/* Allergies / Conditions Summary */}
                <div style={{ fontSize: '12px', color: '#555', marginBottom: '18px', minHeight: '40px' }}>
                  {(p.allergies || []).length > 0 && (
                    <div style={{ marginBottom: '4px' }}>
                      <strong style={{ color: '#B91C1C' }}>Allergies: </strong>
                      {p.allergies.map(a => a.allergen).join(', ')}
                    </div>
                  )}
                  {(p.conditions || []).length > 0 && (
                    <div>
                      <strong style={{ color: '#111' }}>Conditions: </strong>
                      {p.conditions.map(c => c.condition).join(', ')}
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: '#777' }}>
                    Updated: {new Date(p.lastUpdated || p.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <button
                    onClick={() => onSelectPatient(p)}
                    className="btn btn-sm btn-dark"
                  >
                    Open Record →
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
