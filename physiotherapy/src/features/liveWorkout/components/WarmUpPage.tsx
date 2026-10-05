import React, { useState, useEffect } from 'react';
import { Play, SkipForward, Flame, CheckCircle2, Activity } from 'lucide-react';

interface Props {
  onComplete: () => void;
  onSkip: () => void;
}

export const WarmUpPage: React.FC<Props> = ({ onComplete, onSkip }) => {
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const exercises = [
    { name: 'Marching in place', val: '30 sec' },
    { name: 'Shoulder rolls', val: '10 reps' },
    { name: 'Arm circles', val: '10 reps' },
    { name: 'Gentle knee bends', val: '10 reps' },
  ];

  useEffect(() => {
    if (started && progress < 100) {
      const timer = setTimeout(() => setProgress(p => Math.min(p + 5, 100)), 200);
      return () => clearTimeout(timer);
    }
    if (started && progress === 100) {
      const timer = setTimeout(onComplete, 800);
      return () => clearTimeout(timer);
    }
  }, [started, progress, onComplete]);

  return (
    <div className="glass-panel" style={{ padding: '32px', maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <Flame size={32} color="#f59e0b" style={{ margin: '0 auto 16px' }} />
      <h2 style={{ fontSize: '20px', color: '#0f172a', marginBottom: '8px' }}>A short warm up before your rehabilitation exercise</h2>
      <p style={{ color: '#475569', marginBottom: '24px' }}>Warming up increases blood flow and prevents injury.</p>
      
      <div style={{ textAlign: 'left', marginBottom: '24px' }}>
        {exercises.map((ex, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', background: 'rgba(255,255,255,0.8)', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '8px', marginBottom: '8px' }}>
            <div style={{ width: '40px', height: '40px', background: '#e0f2fe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} color="#0284c7" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: started ? '8px' : '0' }}>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{ex.name}</span>
                <span style={{ color: '#475569', fontSize: '14px' }}>{ex.val}</span>
              </div>
              {started && (
                 <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
                   <div style={{ height: '100%', width: `${progress}%`, background: '#10b981', transition: 'width 0.2s linear' }} />
                 </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!started ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => setStarted(true)} style={{ padding: '12px', background: 'linear-gradient(135deg, #0ea5e9, #0284c7)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.2)' }}>
            <Play size={18} /> Start Warm-Up
          </button>
          <button onClick={onSkip} style={{ padding: '10px', background: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px' }}>
            <SkipForward size={14} /> Skip Warm-Up
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '12px', color: '#10b981', fontWeight: 700 }}>
          {progress === 100 ? <CheckCircle2 size={20} /> : <Flame size={20} />}
          {progress === 100 ? 'Warm-Up Complete!' : 'Warming Up...'}
        </div>
      )}
    </div>
  );
};
