import React from 'react';
import { X, FileText, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function DocumentViewerModal({ document, onClose, onDownload }) {
  if (!document) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '820px', padding: '0', overflow: 'hidden' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            backgroundColor: '#1C1C1E',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(229,154,50,0.2)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FileText size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                {document.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px', fontSize: '12px', color: '#9CA3AF' }}>
                <span>{document.category}</span>
                <span>•</span>
                <span>{document.fileSize}</span>
                <span>•</span>
                <span style={{ color: '#4ADE80', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={13} /> Verified Hospital Record
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => {
                if (onDownload) onDownload(document);
                else window.print();
              }}
              className="btn btn-sm btn-primary"
              style={{ padding: '6px 14px' }}
            >
              <Download size={14} /> Download PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#9CA3AF',
                cursor: 'pointer',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Simulated High-Res Document Body */}
        <div style={{ padding: '28px', backgroundColor: '#FAF9F6', maxHeight: '72vh', overflowY: 'auto' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E0D5',
              borderRadius: '12px',
              padding: '36px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              position: 'relative'
            }}
          >
            {/* Watermark / Header Banner */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: '20px',
                borderBottom: '2px solid #111111',
                marginBottom: '24px'
              }}
            >
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111111' }}>
                  {document.hospital}
                </div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666', marginTop: '2px' }}>
                  Department of Clinical Laboratory & Imaging Sciences
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    backgroundColor: '#EAF7ED',
                    color: '#2E7D32',
                    fontSize: '11px',
                    fontWeight: 700
                  }}
                >
                  <ShieldCheck size={14} /> Verified HealthStory Document
                </span>
                <div style={{ fontSize: '11px', color: '#777', marginTop: '4px' }}>
                  Document ID: {document.id}
                </div>
              </div>
            </div>

            {/* Document Metadata Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#F8F6F0',
                borderRadius: '8px',
                marginBottom: '28px',
                fontSize: '12px'
              }}
            >
              <div>
                <div style={{ color: '#777', fontWeight: 500 }}>Health ID</div>
                <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{document.healthId}</div>
              </div>
              <div>
                <div style={{ color: '#777', fontWeight: 500 }}>Date of Record</div>
                <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>
                  {new Date(document.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <div>
                <div style={{ color: '#777', fontWeight: 500 }}>Authorizing Physician</div>
                <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{document.uploadedBy}</div>
              </div>
              <div>
                <div style={{ color: '#777', fontWeight: 500 }}>Category</div>
                <div style={{ fontWeight: 700, color: '#111', marginTop: '2px' }}>{document.category}</div>
              </div>
            </div>

            {/* Summary Text */}
            <div style={{ marginBottom: '28px' }}>
              <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555', marginBottom: '8px' }}>
                Clinical Diagnostic Findings & Impressions
              </h4>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#222', backgroundColor: '#FFF', padding: '14px', borderRadius: '8px', border: '1px solid #ECE7DD' }}>
                {document.reportSummary}
              </p>
            </div>

            {/* Structured Lab Values if applicable */}
            {document.labValues && document.labValues.length > 0 && (
              <div style={{ marginBottom: '28px' }}>
                <h4 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#555', marginBottom: '12px' }}>
                  Quantitative Panel Values
                </h4>
                <div style={{ overflowX: 'auto', border: '1px solid #E6E1D5', borderRadius: '8px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#F4F1EA', borderBottom: '1px solid #E0D9CB' }}>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Test Component</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Result Value</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Standard Unit</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Biological Reference Range</th>
                        <th style={{ padding: '10px 14px', fontWeight: 700 }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {document.labValues.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #EFEBE1' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 600 }}>{row.test}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#111' }}>{row.value}</td>
                          <td style={{ padding: '10px 14px', color: '#666' }}>{row.unit}</td>
                          <td style={{ padding: '10px 14px', color: '#666' }}>{row.range}</td>
                          <td style={{ padding: '10px 14px' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: row.status === 'Optimal' ? '#E8F5E9' : '#EBF3FE',
                                color: row.status === 'Optimal' ? '#2E7D32' : '#1E40AF'
                              }}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Official Hospital Seal & Signoff */}
            <div
              style={{
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px dashed #D0C9BA',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#111' }}>ELECTRONICALLY SIGNED & SEALED</div>
                <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                  Cryptographically verified in HealthStory National Longitudinal Registry.
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#444' }}>
                  SIGNATURE REF: SHA256:{document.id}-VERIFIED-RECORD
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
