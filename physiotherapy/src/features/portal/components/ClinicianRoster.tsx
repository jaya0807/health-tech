import React from 'react';
import { Users, FileText } from 'lucide-react';
import { AlertSeverity } from '../../../core/adaptive/clinicianAlertTrigger.js';

export interface RosterPatient {
  id: string;
  name: string;
  condition: string;
  severity: AlertSeverity;
  latestMqs: number;
  compliancePercent: number;
  lastSessionDate: string;
}

interface ClinicianRosterProps {
  patients: RosterPatient[];
  onSelectPatient: (patientId: string) => void;
}

export const ClinicianRoster: React.FC<ClinicianRosterProps> = ({ patients, onSelectPatient }) => {
  const getBadgeInfo = (severity: AlertSeverity) => {
    switch (severity) {
      case 'RED_EMERGENCY': return { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', text: '#fca5a5', label: 'Review' };
      case 'YELLOW_WARNING': return { bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', text: '#fde68a', label: 'Watch' };
      default: return { bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', text: '#6ee7b7', label: 'Good' };
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={18} color="#0f172a" />
          <h3 style={{ margin: 0, fontSize: '17px', color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>Patients</h3>
        </div>
        <span style={{ fontSize: '12px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{patients.length} Active {patients.length === 1 ? 'Patient' : 'Patients'}</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.1)', color: '#475569' }}>
            <th style={{ padding: '10px 8px' }}>Patient</th>
            <th style={{ padding: '10px 8px' }}>Condition</th>
            <th style={{ padding: '10px 8px' }}>Status</th>
            <th style={{ padding: '10px 8px' }}>Score</th>
            <th style={{ padding: '10px 8px' }}>Sessions</th>
            <th style={{ padding: '10px 8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => {
            const badge = getBadgeInfo(p.severity);
            return (
              <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <td style={{ padding: '12px 8px', fontWeight: 600, color: '#0f172a' }}>{p.name}</td>
                <td style={{ padding: '12px 8px', color: '#334155' }}>{p.condition}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: badge.bg, border: `1px solid ${badge.border}`, color: badge.border }}>
                    {badge.label}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', color: '#0f172a', fontWeight: 700 }}>{p.latestMqs}%</td>
                <td style={{ padding: '12px 8px', color: p.compliancePercent >= 80 ? '#10b981' : '#f59e0b', fontWeight: 600 }}>{p.compliancePercent}%</td>
                <td style={{ padding: '12px 8px' }}>
                  <button onClick={() => onSelectPatient(p.id)} style={{ padding: '5px 12px', background: '#e2e8f0', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={13} /> Edit Plan
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
