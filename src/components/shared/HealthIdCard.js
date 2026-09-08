import React from 'react';
import { ShieldCheck, Heart, Printer, QrCode } from 'lucide-react';

export default function HealthIdCard({ patient, onPrint, isCompact = false }) {
  if (!patient) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #18191B 0%, #26272B 100%)',
        borderRadius: isCompact ? '16px' : '22px',
        padding: isCompact ? '20px' : '28px',
        color: '#FFFFFF',
        boxShadow: '0 20px 48px rgba(0,0,0,0.22)',
        border: '1px solid rgba(255,255,255,0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle Background Accent Pattern */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(229,154,50,0.22) 0%, rgba(229,154,50,0) 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-50px',
          left: '-20px',
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(53,168,83,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: isCompact ? '16px' : '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#111111'
            }}
          >
            <Heart size={20} fill="#111111" strokeWidth={0} />
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              HealthStory
            </div>
            <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-soft)' }}>
              Universal Health ID
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 9px',
              fontSize: '11px',
              fontWeight: 700,
              borderRadius: '999px',
              backgroundColor: 'rgba(53, 168, 83, 0.2)',
              color: '#4ADE80',
              border: '1px solid rgba(53, 168, 83, 0.4)'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80' }} />
            Active
          </span>
          {onPrint && (
            <button
              onClick={onPrint}
              className="btn btn-sm btn-ghost no-print"
              title="Print Health ID"
              style={{ color: '#CCC', padding: '4px 8px' }}
            >
              <Printer size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Main Health ID Code */}
      <div style={{ marginBottom: isCompact ? '16px' : '22px' }}>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E8E93', marginBottom: '4px' }}>
          Verified Universal Health Identifier
        </div>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: isCompact ? '20px' : '26px',
            fontWeight: 800,
            letterSpacing: '0.08em',
            color: 'var(--accent-soft)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          {patient.healthId}
          <ShieldCheck size={20} color="var(--accent-primary)" />
        </div>
      </div>

      {/* Patient Grid Details */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr 1fr' : '1.4fr 1fr 1fr',
          gap: '14px',
          padding: '14px 16px',
          borderRadius: '14px',
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: '16px'
        }}
      >
        <div>
          <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.04em' }}>Patient Name</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginTop: '2px' }}>{patient.name}</div>
        </div>

        <div>
          <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.04em' }}>Blood Group</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#F87171', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {patient.bloodGroup}
          </div>
        </div>

        {!isCompact && (
          <div>
            <div style={{ fontSize: '10.5px', textTransform: 'uppercase', color: '#9CA3AF', letterSpacing: '0.04em' }}>Age / Sex</div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#E5E7EB', marginTop: '2px' }}>
              {patient.age} yrs • {patient.gender}
            </div>
          </div>
        )}
      </div>

      {/* Footer / QR / Verification Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#9CA3AF' }}>Primary Affiliation</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#D1D5DB' }}>{patient.primaryHospital}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '9.5px', color: '#9CA3AF' }}>Registered</div>
            <div style={{ fontSize: '11px', color: '#E5E7EB', fontWeight: 500 }}>
              {new Date(patient.registeredAt || '2021-06-18').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div
            style={{
              width: '38px',
              height: '38px',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              color: '#111'
            }}
          >
            <QrCode size={28} />
          </div>
        </div>
      </div>
    </div>
  );
}
