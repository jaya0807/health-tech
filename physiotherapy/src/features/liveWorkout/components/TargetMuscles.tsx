import React from 'react';
import { Activity } from 'lucide-react';

interface TargetMusclesProps {
  exerciseName: string;
}

interface Muscle {
  name: string;
  intensity: 'High' | 'Medium' | 'Low';
  level: number;
}

export const TargetMuscles: React.FC<TargetMusclesProps> = ({ exerciseName }) => {
  const getMuscles = (): Muscle[] => {
    if (exerciseName.includes('Squat')) {
      return [
        { name: 'Quadriceps', intensity: 'High', level: 90 },
        { name: 'Gluteus Maximus', intensity: 'High', level: 85 },
        { name: 'Core', intensity: 'Medium', level: 60 }
      ];
    }
    if (exerciseName.includes('Knee')) {
      return [
        { name: 'Quadriceps', intensity: 'High', level: 95 },
        { name: 'Hamstrings', intensity: 'Low', level: 30 }
      ];
    }
    if (exerciseName.includes('Shoulder') || exerciseName.includes('Wall Crawl')) {
      return [
        { name: 'Anterior Deltoid', intensity: 'High', level: 90 },
        { name: 'Rotator Cuff', intensity: 'Medium', level: 70 },
        { name: 'Upper Trapezius', intensity: 'Medium', level: 65 }
      ];
    }
    if (exerciseName.includes('Hip') || exerciseName.includes('Glute')) {
      return [
        { name: 'Gluteus Maximus', intensity: 'High', level: 95 },
        { name: 'Hamstrings', intensity: 'Medium', level: 75 },
        { name: 'Erector Spinae', intensity: 'Low', level: 40 }
      ];
    }
    return [];
  };

  const muscles = getMuscles();

  return (
    <div className="glass-panel" style={{ padding: '24px', width: '100%', marginBottom: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <Activity size={20} color="#10b981" />
        <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Targeted Muscles</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {muscles.map((m, idx) => (
          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#334155', fontWeight: 500 }}>
              <span>{m.name}</span>
              <span style={{ color: m.intensity === 'High' ? '#10b981' : m.intensity === 'Medium' ? '#f59e0b' : '#64748b', fontSize: '12px', fontWeight: 600 }}>
                {m.intensity}
              </span>
            </div>
            <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ 
                height: '100%', 
                width: `${m.level}%`, 
                backgroundColor: m.intensity === 'High' ? '#10b981' : m.intensity === 'Medium' ? '#f59e0b' : '#94a3b8',
                borderRadius: '2px',
                transition: 'width 1s ease-out'
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
