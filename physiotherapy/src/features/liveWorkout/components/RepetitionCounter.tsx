import React from 'react';

export interface RepCounterProps {
  completedReps: number;
  targetReps: number;
  phase?: string;
  currentMqs?: number;
}

export function formatRepetitionStats(completedReps = 0, targetReps = 10, currentMqs = 0) {
  const percentage = Math.min(100, Math.round((completedReps / Math.max(1, targetReps)) * 100));
  const isComplete = completedReps >= targetReps;
  return { completedReps, targetReps, percentage, isComplete, currentMqs: Math.round(currentMqs) };
}

export const RepetitionCounter: React.FC<RepCounterProps> = ({ completedReps, targetReps, phase, currentMqs = 90 }) => {
  const stats = formatRepetitionStats(completedReps, targetReps, currentMqs);

  return (
    <div className="glass-panel" style={{ padding: '16px 12px', display: 'flex', alignItems: 'center', whiteSpace: 'nowrap', width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
        <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Reps</span>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap' }}>
          {stats.completedReps} <span style={{ fontSize: '16px', color: '#64748b' }}>/ {stats.targetReps}</span>
        </div>
      </div>
      {phase && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(0,0,0,0.1)', flex: 1 }}>
          <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Phase</span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#10b981', whiteSpace: 'nowrap', marginTop: '6px' }}>{phase}</span>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderLeft: '1px solid rgba(0,0,0,0.1)', flex: 1 }}>
        <span style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '1px' }}>Accuracy</span>
        <span style={{ fontSize: '16px', fontWeight: 700, color: stats.currentMqs >= 80 ? '#10b981' : '#f59e0b', whiteSpace: 'nowrap', marginTop: '6px' }}>{stats.currentMqs}%</span>
      </div>
    </div>
  );
};
