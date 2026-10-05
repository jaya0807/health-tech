import React, { useState } from 'react';
import { HeartPulse, UserPlus, Activity, TrendingUp, FileText } from 'lucide-react';
import { PatientOnboardingModal, PatientProfile } from './features/onboarding/PatientOnboardingModal.js';
import { RosterPatient } from './features/portal/components/ClinicianRoster.js';
import { PrescriptionData } from './features/portal/components/PrescriptionEditor.js';
import { WorkoutTab } from './features/liveWorkout/components/WorkoutTab.js';
import { TwinTab } from './features/digitalTwin/components/TwinTab.js';
import { PortalTab } from './features/portal/components/PortalTab.js';

export const App: React.FC = () => {
  const [tab, setTab] = useState<'onboard' | 'workout' | 'twin' | 'portal'>('onboard');
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [patients, setPatients] = useState<RosterPatient[]>([]);
  const [rx, setRx] = useState<PrescriptionData>({ targetAngleDeg: 90, targetReps: 10, holdDurationSec: 2, sessionsPerDay: 2 });

  const handleSelectPatient = (id: string) => {
    const p = patients.find(x => x.id === id);
    if (!p) return;
    
    let area = 'Knee';
    if (p.condition.includes('Shoulder') || p.condition.includes('Rotator')) area = 'Shoulder';
    if (p.condition.includes('Spine') || p.condition.includes('Lumbar')) area = 'Spine';
    if (p.condition.includes('Hip')) area = 'Hip';
    
    setPatient({
      name: p.name,
      age: 30,
      gender: 'Unknown',
      condition: p.condition,
      recoveryArea: area,
      painVas: 2,
    });
    
    setRx({
      targetAngleDeg: 90,
      targetReps: 10,
      holdDurationSec: 2,
      sessionsPerDay: 2
    });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(0, 0, 0, 0.05)', background: 'rgba(255, 255, 255, 0.4)', backdropFilter: 'blur(16px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #38bdf8, #0284c7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartPulse size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>PhysioCare</div>
            <div style={{ fontSize: '12px', color: '#475569' }}>{patient ? `${patient.name} • ${patient.condition}` : 'New Profile Setup'}</div>
          </div>
        </div>
        <nav style={{ display: 'flex', gap: '8px' }}>
          {[ 
            { id: 'onboard', label: 'Profile', icon: UserPlus }, 
            { id: 'workout', label: 'Exercise', icon: Activity }, 
            { id: 'twin', label: 'Progress', icon: TrendingUp }, 
            { id: 'portal', label: 'Clinical', icon: FileText } 
          ].map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id as any)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: tab === t.id ? 'linear-gradient(135deg, #38bdf8, #0284c7)' : 'rgba(255, 255, 255, 0.6)', border: tab === t.id ? '1px solid #38bdf8' : '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', color: tab === t.id ? '#fff' : '#0f172a', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main style={{ padding: '24px 32px', maxWidth: '1280px', width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {(!patient || tab === 'onboard') && (
          <PatientOnboardingModal onComplete={(p) => { 
            setPatient(p); 
            setPatients([...patients, { id: Date.now().toString(), name: p.name, condition: p.condition, severity: 'GREEN_PROGRESS', latestMqs: 100, compliancePercent: 100, lastSessionDate: new Date().toISOString().split('T')[0] }]);
            setTab('workout'); 
          }} />
        )}

        {patient && tab === 'workout' && (
          <WorkoutTab 
            patient={patient} 
            rx={rx} 
            isActiveTab={tab === 'workout'}
            onPainChange={(v) => setPatient({ ...patient, painVas: v })} 
          />
        )}

        {patient && tab === 'twin' && (
          <TwinTab patient={patient} />
        )}

        {patient && tab === 'portal' && (
          <PortalTab 
            patient={patient}
            patients={patients}
            rx={rx}
            onSaveRx={setRx}
            onSelectPatient={handleSelectPatient}
          />
        )}
      </main>
    </div>
  );
};
