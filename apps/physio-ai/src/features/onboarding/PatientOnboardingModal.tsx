import React, { useState } from 'react';
import { Play, Stethoscope } from 'lucide-react';
import { exercisesByCondition } from '../../shared/utils/exerciseConfigs.js';

export interface PatientProfile {
  name: string;
  age: number;
  gender: string;
  recoveryArea: string;
  condition: string;
  painVas: number;
  selectedExercise?: string;
  warmupStatus?: 'completed' | 'skipped';
}

interface Props {
  onComplete: (profile: PatientProfile) => void;
}

export const PatientOnboardingModal: React.FC<Props> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [age] = useState(30);
  const [gender] = useState('Male');
  const [area, setArea] = useState('Knee');
  const [condition, setCondition] = useState('ACL Reconstruction');
  const [exercise, setExercise] = useState(exercisesByCondition['ACL Reconstruction'][0]);
  const [pain, setPain] = useState(3);

  const allConditions = [
    'ACL Reconstruction',
    'Knee Replacement',
    'Ankle Injury',
    'Lower Back Pain',
    'Shoulder Rehabilitation',
  ];

  const getAreaForCondition = (cond: string) => {
    if (cond === 'Ankle Injury') return 'Ankle';
    if (cond === 'Lower Back Pain') return 'Back';
    if (cond === 'Shoulder Rehabilitation') return 'Shoulder';
    return 'Knee';
  };

  const handleConditionChange = (newCond: string) => {
    setCondition(newCond);
    const newArea = getAreaForCondition(newCond);
    setArea(newArea);
    setExercise(exercisesByCondition[newCond]?.[0] ?? '');
  };

  const handleStart = () => {
    onComplete({ name, age, gender, recoveryArea: area, condition, painVas: pain, selectedExercise: exercise });
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Stethoscope size={20} color="#0f172a" />
        <h2 style={{ margin: 0, fontSize: '18px', color: '#0f172a', fontFamily: 'Outfit, sans-serif' }}>Profile Setup</h2>
      </div>
      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '13px', alignItems: 'center' }}>
        Full Name:
        <input value={name} onChange={(e) => setName(e.target.value)} style={{ background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '6px 8px', width: '200px' }} />
      </label>
      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '13px', alignItems: 'center' }}>
        Diagnosis / Surgery:
        <select value={condition} onChange={(e) => handleConditionChange(e.target.value)} style={{ background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '6px', cursor: 'pointer', width: '200px' }}>
          {allConditions.map((c) => <option key={c} value={c} style={{ background: '#fff' }}>{c}</option>)}
        </select>
      </label>
      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '13px', alignItems: 'center' }}>
        Exercise:
        <select value={exercise} onChange={(e) => setExercise(e.target.value)} style={{ background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '4px', padding: '6px', cursor: 'pointer', width: '200px' }}>
          {(exercisesByCondition[condition] || []).map((ex) => <option key={ex} value={ex} style={{ background: '#fff' }}>{ex}</option>)}
        </select>
      </label>
      <label style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '13px', alignItems: 'center' }}>
        Current Pain (0–10):
        <input type="range" min="0" max="10" value={pain} onChange={(e) => setPain(Number(e.target.value))} style={{ accentColor: '#0ea5e9', width: '150px' }} />
        <span style={{ fontWeight: 600, color: pain > 5 ? '#f43f5e' : '#0f172a', width: '30px', textAlign: 'right' }}>{pain}/10</span>
      </label>
      <button onClick={handleStart} style={{ marginTop: '12px', padding: '12px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>
        <Play size={16} /> Start Exercise Session
      </button>
    </div>
  );
};
