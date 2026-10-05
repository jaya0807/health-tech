import React from 'react';

export interface MqsRingProps {
  score?: number; // 0 - 100
  radius?: number;
  size?: number;
  strokeWidth?: number;
}

export function calculateMqsRingGeometry(score = 0, radius = 36, strokeWidth = 6) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let color = 'var(--bio-emerald, #10b981)';
  if (normalizedScore < 70) color = 'var(--warning-amber, #f59e0b)';
  if (normalizedScore < 50) color = 'var(--acute-ruby, #ef4444)';

  return { radius, strokeWidth, circumference, strokeDashoffset, color, score: normalizedScore };
}

export const CircularMqsRing: React.FC<MqsRingProps> = ({ score = 85, radius = 36, strokeWidth = 6 }) => {
  const geom = calculateMqsRingGeometry(score, radius, strokeWidth);
  const size = (radius + strokeWidth) * 2;

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={geom.color}
          strokeWidth={strokeWidth}
          strokeDasharray={geom.circumference}
          strokeDashoffset={geom.strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>{Math.round(geom.score)}%</span>
        <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>FORM</div>
      </div>
    </div>
  );
};
