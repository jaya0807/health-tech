import React, { useState, useEffect, useRef } from 'react';
import { Activity, Target, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

// 1. Live Form Status Overlay
export const LiveFormStatus: React.FC<{ currentAngle: number; targetAngle: number; stability: number; coachMessage: string }> = ({ currentAngle, targetAngle, stability, coachMessage }) => {
  const isGood = stability > 70 && currentAngle > 10;
  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', width: '200px' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live Form</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isGood ? '#10b981' : '#f59e0b', fontWeight: 700, fontSize: '14px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isGood ? '#10b981' : '#f59e0b', boxShadow: `0 0 10px ${isGood ? 'rgba(16,185,129,0.5)' : 'rgba(245,158,11,0.5)'}` }} />
        {isGood ? 'Good Form' : 'Needs Adjusting'}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px', color: '#334155' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>ROM:</span> <strong>{currentAngle < 0 ? '--' : Math.round(currentAngle)}° / {targetAngle}°</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Alignment:</span> <strong>{currentAngle < 0 ? '--' : (isGood ? 'Good' : 'Off-center')}</strong></div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Stability:</span> <strong>{currentAngle < 0 ? '--' : Math.round(stability)}%</strong></div>
      </div>
      {coachMessage && (
        <div style={{ marginTop: '4px', padding: '8px', background: 'rgba(245,158,11,0.1)', color: '#d97706', borderRadius: '6px', fontSize: '12px', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
          <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '1px' }} />
          <span style={{ lineHeight: '1.2' }}>{coachMessage}</span>
        </div>
      )}
    </div>
  );
};

// 2. Rep Quality Stats
export const RepQualityStats: React.FC<{ reps: number; targetReps: number; formQuality: number; stability: number }> = ({ reps, targetReps, formQuality, stability }) => {
  const stats = [
    { label: 'REPS', value: `${reps}/${targetReps}` },
    { label: 'CORRECT', value: reps },
    { label: 'FORM', value: `${Math.round(formQuality)}%` },
    { label: 'STABILITY', value: `${Math.round(stability)}%` },
  ];
  return (
    <div className="glass-panel" style={{ display: 'flex', width: '100%', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
      {stats.map((s, i) => (
        <div key={i} style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRight: i < stats.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', background: 'rgba(255,255,255,0.7)' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', marginBottom: '8px' }}>{s.label}</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>{s.value}</div>
        </div>
      ))}
    </div>
  );
};

interface DataPoint {
  time: number;
  angle: number;
}

// 3. Live Movement Graph
export const LiveMovementGraph: React.FC<{ currentAngle: number; targetAngle: number }> = ({ currentAngle, targetAngle }) => {
  const [history, setHistory] = useState<DataPoint[]>([]);
  const currentAngleRef = useRef(currentAngle);
  const graphDurationMs = 8000; // 8 seconds of history
  
  useEffect(() => {
    currentAngleRef.current = currentAngle;
  }, [currentAngle]);

  useEffect(() => {
    let animationFrameId: number;
    let lastUpdate = performance.now();

    const updateGraph = (timestamp: number) => {
      if (timestamp - lastUpdate > 50) { // ~20fps
        setHistory(prev => {
          const now = Date.now();
          const newPoint = { time: now, angle: currentAngleRef.current };
          const cutoff = now - graphDurationMs;
          return [...prev.filter(p => p.time > cutoff), newPoint];
        });
        lastUpdate = timestamp;
      }
      animationFrameId = requestAnimationFrame(updateGraph);
    };
    
    animationFrameId = requestAnimationFrame(updateGraph);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const maxAngle = Math.max(targetAngle + 20, 150, currentAngle + 20);
  const now = history.length > 0 ? history[history.length - 1].time : Date.now();
  
  if (currentAngle < 0 || history.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', alignItems: 'center', justifyContent: 'center', minHeight: '145px' }}>
        <Activity size={24} color="#94a3b8" style={{ marginBottom: '8px', opacity: 0.5 }} />
        <div style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>Waiting for movement data...</div>
        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '4px' }}>Please step into the camera frame</div>
      </div>
    );
  }

  const pts = history.map((p) => {
    const x = ((p.time - (now - graphDurationMs)) / graphDurationMs) * 100;
    const y = 100 - (p.angle / maxAngle) * 100;
    return `${Math.max(0, Math.min(100, x)).toFixed(1)},${Math.max(0, Math.min(100, y)).toFixed(1)}`;
  }).join(' ');

  return (
    <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={14} color="#0ea5e9" /> Live Joint Angle
        </div>
        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Time →</div>
      </div>
      <div style={{ height: '100px', width: '100%', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.1)', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
        {/* Target line */}
        {targetAngle > 0 && (
          <>
            <div style={{ position: 'absolute', top: `${100 - (targetAngle / maxAngle) * 100}%`, left: 0, width: '100%', borderTop: '1px dashed #10b981', opacity: 0.5 }} />
            <span style={{ position: 'absolute', top: `${100 - (targetAngle / maxAngle) * 100}%`, right: '4px', transform: 'translateY(-100%)', fontSize: '10px', color: '#10b981', fontWeight: 700 }}>Target {targetAngle}°</span>
          </>
        )}
        
        <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          {history.length > 1 && (
            <polyline points={pts} fill="none" stroke="#0ea5e9" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
          )}
        </svg>
      </div>
    </div>
  );
};

// 4. Target vs Actual Today's Progress
export const TargetVsActual: React.FC<{ reps: number; targetReps: number; maxAngle: number; targetAngle: number; formQuality: number; stability: number }> = ({ reps, targetReps, maxAngle, targetAngle, formQuality, stability }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'rgba(255,255,255,0.8)', flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Target size={16} color="#8b5cf6" /> Today's Progress
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <ProgressRow label="ROM" target={`${targetAngle}°`} actual={`${Math.round(maxAngle)}°`} progress={Math.min(100, (maxAngle/targetAngle)*100)} color="#0ea5e9" />
        <ProgressRow label="Repetitions" target={targetReps.toString()} actual={reps.toString()} progress={Math.min(100, (reps/targetReps)*100)} color="#10b981" />
        <ProgressRow label="Form Quality" target="80%" actual={`${Math.round(formQuality)}%`} progress={Math.min(100, (formQuality/80)*100)} color="#f59e0b" />
        <ProgressRow label="Stability" target="80%" actual={`${Math.round(stability)}%`} progress={Math.min(100, (stability/80)*100)} color="#8b5cf6" />
      </div>
    </div>
  );
};

const ProgressRow = ({ label, target, actual, progress, color }: any) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
      <span style={{ color: '#475569', fontWeight: 600 }}>{label}</span>
      <span style={{ color: '#0f172a', fontWeight: 700 }}>{actual} <span style={{ color: '#94a3b8', fontWeight: 400 }}>/ {target}</span></span>
    </div>
    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${progress}%`, background: color, borderRadius: '3px' }} />
    </div>
  </div>
);
