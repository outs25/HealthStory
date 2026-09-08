import React from 'react';
import { Heart, LogOut, ArrowRight } from 'lucide-react';

export default function Navbar({
  currentRole,
  currentStaff,
  currentPatient,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout
}) {

  return (
    <header
      className="no-print"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
      }}
    >
      <div
        style={{
          maxWidth: '1360px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Brand Logo & Tagline */}
        <div
          onClick={() => onNavigate('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111111',
              boxShadow: '0 4px 12px rgba(229,154,50,0.3)'
            }}
          >
            <Heart size={22} fill="#111111" strokeWidth={0} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '19px', fontWeight: 900, letterSpacing: '-0.03em', color: '#111111' }}>
                HealthStory
              </span>
              {currentRole === 'admin' && (
                <span className="badge badge-accent" style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Staff Portal
                </span>
              )}
              {currentRole === 'patient' && (
                <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 7px' }}>
                  Patient View
                </span>
              )}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
              Every Record. One Health Story.
            </div>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {currentRole === 'guest' && (
            <>
              <button
                onClick={() => onNavigate('landing')}
                className={`btn btn-sm ${currentView === 'landing' ? 'btn-ghost' : 'btn-ghost'}`}
                style={{ fontWeight: currentView === 'landing' ? 700 : 500 }}
              >
                Overview
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('landing');
                }}
                className="btn btn-sm btn-ghost"
              >
                How It Works
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('health-id-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else onNavigate('landing');
                }}
                className="btn btn-sm btn-ghost"
              >
                Health ID
              </button>
            </>
          )}

          {currentRole === 'admin' && (
            <>
              <button
                onClick={() => onNavigate('admin_dashboard')}
                className={`btn btn-sm ${currentView === 'admin_dashboard' ? 'btn-dark' : 'btn-ghost'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('admin_patients')}
                className={`btn btn-sm ${currentView === 'admin_patients' ? 'btn-dark' : 'btn-ghost'}`}
              >
                Patients Directory
              </button>
            </>
          )}

          {currentRole === 'patient' && (
            <>
              <button
                onClick={() => onNavigate('patient_dashboard')}
                className={`btn btn-sm ${currentView === 'patient_dashboard' ? 'btn-dark' : 'btn-ghost'}`}
              >
                My Health Journey
              </button>
            </>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentRole === 'guest' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => onOpenAuth('patient')}
                className="btn btn-sm btn-outline"
                style={{ fontWeight: 600 }}
              >
                Patient Portal
              </button>
              <button
                onClick={() => onOpenAuth('admin')}
                className="btn btn-sm btn-dark"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                Doctor & Staff Portal <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentRole === 'admin' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                      {currentStaff?.name || 'Staff Member'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#666' }}>
                      {currentStaff?.staffId} • {currentStaff?.hospital?.split(' ')[0]}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--accent-light)',
                      border: '2px solid var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: 'var(--accent-dark)',
                      fontSize: '13px'
                    }}
                  >
                    {currentStaff?.name?.charAt(0) || 'D'}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>
                      {currentPatient?.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#059669', fontFamily: 'monospace', fontWeight: 600 }}>
                      {currentPatient?.healthId}
                    </div>
                  </div>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: '#EAF7ED',
                      border: '2px solid #35A853',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      color: '#2E7D32',
                      fontSize: '13px'
                    }}
                  >
                    {currentPatient?.name?.charAt(0) || 'P'}
                  </div>
                </div>
              )}

              <button
                onClick={onLogout}
                className="btn btn-sm btn-ghost"
                title="Sign Out"
                style={{ padding: '6px', color: '#777' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
