import React from 'react';
import { Cable, AlertCircle } from 'lucide-react';

export default function WiringDiagram({ pins = [], notes = '' }) {
  if (!pins || pins.length === 0) return null;

  return (
    <div className="wiring-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary)' }}>
        <Cable size={20} />
        <h4 style={{ margin: 0 }}>Panduan Koneksi & Pengkabelan (Wiring Diagram)</h4>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="wiring-table">
          <thead>
            <tr>
              <th>Pin ESP32</th>
              <th>Komponen Target</th>
              <th>Pin Target</th>
              <th>Warna Kabel</th>
              <th>Fungsi / Catatan</th>
            </tr>
          </thead>
          <tbody>
            {pins.map((pin, idx) => (
              <tr key={idx}>
                <td>
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--primary)' }}>
                    {pin.espPin}
                  </strong>
                </td>
                <td>{pin.targetComponent}</td>
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {pin.targetPin}
                  </span>
                </td>
                <td>
                  <span
                    className="wire-badge"
                    style={{ backgroundColor: pin.wireColor || '#94a3b8' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {pin.wireColor}
                  </span>
                </td>
                <td>{pin.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {notes && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: 'rgba(245, 158, 11, 0.08)',
            borderLeft: '3px solid var(--warning)',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: 'var(--warning)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={16} style={{ flexShrink: 0 }} />
          <span>{notes}</span>
        </div>
      )}
    </div>
  );
}
