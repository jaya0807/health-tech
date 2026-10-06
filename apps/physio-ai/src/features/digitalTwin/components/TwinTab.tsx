import React from 'react';
import { Activity, TrendingUp, Calendar, Zap, ShieldCheck } from 'lucide-react';
import { PatientProfile } from '../../onboarding/PatientOnboardingModal.js';
import { getAreaLabels } from '../../../shared/utils/exerciseConfigs.js';
import { CircularMqsRing } from '../../../shared/components/CircularMqsRing.js';

interface TwinTabProps {
  patient: PatientProfile;
}

export const TwinTab: React.FC<TwinTabProps> = ({ patient }) => {
  const labels = getAreaLabels(patient.recoveryArea);

  // Generate realistic 10-day historical trend that terminates precisely at the patient's current state
  const painData = Array.from({ length: 10 }).map((_, i) => {
    if (i === 9) return patient.painVas;
    return Math.min(10, Math.round(patient.painVas + ((9 - i) * 0.6) + (Math.random() * 0.5)));
  });
  
  const formData = Array.from({ length: 10 }).map((_, i) => {
    return Math.min(100, Math.round(40 + (i * 5) + (Math.random() * 5)));
  });
  
  const romData = Array.from({ length: 10 }).map((_, i) => {
    return Math.min(130, Math.round(45 + (i * 6) + (Math.random() * 5)));
  });

  const maxRom = Math.max(...romData);
  const currentPain = patient.painVas;
  const currentForm = formData[9];
  
  const recoveryScore = 78; // overall %

  // SVG Graph generators
  const renderLineGraph = (data: number[], color: string) => {
    const max = 100;
    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = 100 - (val / max) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        {/* Area fill */}
        <polygon points={`0,100 ${pts} 100,100`} fill={`url(#gradient-${color.replace('#', '')})`} opacity={0.2} />
        {/* Line */}
        <polyline points={pts} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  const renderTwinSvg = (area: string) => {
    const areaLower = area.toLowerCase();
    if (areaLower.includes('spine') || areaLower.includes('lumbar') || areaLower.includes('back')) {
      return (
        <svg width="140" height="200" viewBox="0 0 100 160" fill="none" style={{ zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.4))' }}>
          {/* Spine Vertebrae (Curved) */}
          <path d="M45 20 Q 60 80, 45 140" stroke="#cbd5e1" strokeWidth="4" fill="none" />
          {[20, 40, 60, 80, 100, 120, 140].map((y, i) => {
            const xOffset = i < 3 ? i * 3 : (6 - i) * 3;
            return (
              <rect key={y} x={40 + xOffset} y={y - 8} width="24" height="16" rx="4" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="2" />
            );
          })}
          {/* Healing Aura around Lumbar (bottom) */}
          <circle cx="45" cy="120" r="32" fill="url(#healing-grad)" opacity="0.9" />
          <circle cx="45" cy="120" r="10" fill="#10b981" />
          <defs>
            <radialGradient id="healing-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
    if (areaLower.includes('shoulder')) {
      return (
        <svg width="140" height="200" viewBox="0 0 100 160" fill="none" style={{ zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.4))' }}>
          {/* Torso/Collarbone */}
          <path d="M10 40 Q 50 20 80 40 L 80 160 L 10 160 Z" fill="rgba(255,255,255,0.5)" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
          {/* Arm Bone (Humerus) */}
          <path d="M65 50 C 85 40, 95 60, 85 130 C 80 140, 70 140, 65 130 C 60 60, 65 50, 65 50 Z" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="2" />
          {/* Healing Aura at Shoulder Joint */}
          <circle cx="72" cy="52" r="28" fill="url(#healing-grad)" opacity="0.9" />
          <circle cx="72" cy="52" r="10" fill="#10b981" />
          <defs>
            <radialGradient id="healing-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
    if (areaLower.includes('hip')) {
      return (
        <svg width="140" height="200" viewBox="0 0 100 160" fill="none" style={{ zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.4))' }}>
          {/* Pelvis */}
          <path d="M20 50 C 20 30, 80 30, 80 50 C 90 70, 50 100, 50 100 C 50 100, 10 70, 20 50 Z" fill="rgba(255,255,255,0.8)" stroke="#94a3b8" strokeWidth="2" />
          {/* Femur */}
          <path d="M65 80 C 80 75, 90 85, 80 150 C 75 160, 65 160, 60 150 C 55 90, 60 85, 65 80 Z" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="2" />
          {/* Healing Aura at Hip Joint */}
          <circle cx="70" cy="85" r="28" fill="url(#healing-grad)" opacity="0.9" />
          <circle cx="70" cy="85" r="10" fill="#10b981" />
          <defs>
            <radialGradient id="healing-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      );
    }
    
    // Default: Knee (The two bones - Femur and Tibia)
    return (
      <svg width="140" height="200" viewBox="0 0 100 160" fill="none" style={{ zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(16,185,129,0.4))' }}>
        {/* Upper Bone (Femur) */}
        <path d="M40 10 C 40 0, 60 0, 60 10 L 56 60 C 65 65, 65 75, 56 80 L 44 80 C 35 75, 35 65, 44 60 Z" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="2" />
        {/* Lower Bone (Tibia) */}
        <path d="M44 85 C 35 90, 35 100, 44 105 L 40 150 C 40 160, 60 160, 60 150 L 56 105 C 65 100, 65 90, 56 85 Z" fill="rgba(255,255,255,0.95)" stroke="#94a3b8" strokeWidth="2" />
        {/* Joint Capsule / Patella */}
        <circle cx="50" cy="82" r="28" fill="url(#healing-grad)" opacity="0.9" />
        <circle cx="50" cy="82" r="8" fill="#10b981" />
        <defs>
          <radialGradient id="healing-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '28px', color: '#0f172a', fontWeight: 800 }}>Recovery Progress</h1>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '15px' }}>{patient.recoveryArea} • {patient.condition}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <Zap size={16} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '14px' }}>7 Day Streak!</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        
        {/* LEFT COLUMN: Main Graphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* ROM Graph */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <Activity size={16} /> Range of Motion (ROM)
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{maxRom}° <span style={{ fontSize: '14px', color: '#10b981', fontWeight: 600 }}>+15° this week</span></div>
              </div>
              <div style={{ background: 'rgba(14, 165, 233, 0.1)', color: '#0ea5e9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>Last 10 Days</div>
            </div>
            
            <div style={{ height: '200px', width: '100%', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.05)', borderLeft: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
              {renderLineGraph(romData, '#0ea5e9')}
            </div>
          </div>

          {/* Dual Graph: Pain vs Form */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f43f5e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Pain Level Trend</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{currentPain}/10</div>
              <div style={{ height: '80px', width: '100%', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {renderLineGraph(painData.map(p => p * 10), '#f43f5e')}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Form Quality (MQS)</div>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{currentForm}%</div>
              <div style={{ height: '80px', width: '100%', position: 'relative', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {renderLineGraph(formData, '#10b981')}
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Digital Twin & Overall */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Digital Twin */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: '20px', zIndex: 2 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#8b5cf6', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Digital Twin</div>
              <ShieldCheck size={18} color="#10b981" />
            </div>

            {/* Glowing Avatar/Joint Abstract Representation */}
            <div style={{ position: 'relative', width: '200px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Background Glow */}
              <div style={{ position: 'absolute', width: '120px', height: '120px', background: '#10b981', filter: 'blur(40px)', opacity: 0.3, borderRadius: '50%' }} />
              
              {/* Abstract Joint Wireframe SVG */}
              {renderTwinSvg(patient.recoveryArea)}

              {/* Status Labels */}
              <div style={{ position: 'absolute', right: '0px', top: '90px', background: '#fff', padding: '6px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800, color: '#10b981', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 3 }}>
                {patient.recoveryArea} Safe
              </div>
            </div>
            
            <div style={{ marginTop: '20px', width: '100%', background: 'rgba(255,255,255,0.7)', padding: '12px', borderRadius: '12px', fontSize: '12px', color: '#475569', textAlign: 'center', lineHeight: '1.5', fontWeight: 500 }}>
              Tissue regeneration in {patient.recoveryArea.toLowerCase()} is tracking <strong>ahead of schedule</strong>.
            </div>
          </div>

          {/* Recovery Score */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Overall Recovery</div>
            <CircularMqsRing score={recoveryScore} size={120} />
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>Estimated Full Recovery:</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>~4 Weeks</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
