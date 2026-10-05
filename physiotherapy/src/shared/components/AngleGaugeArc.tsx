import React from 'react';

export interface AngleGaugeProps {
  currentAngle?: number;
  currentAngleDeg?: number;
  targetAngle?: number;
  targetAngleDeg?: number;
  size?: number;
}

export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return { x: centerX + radius * Math.cos(angleInRadians), y: centerY + radius * Math.sin(angleInRadians) };
}

export function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');
}

export function getGaugeColor(current: number, target: number): string {
  const delta = Math.abs(current - target);
  if (delta <= 5) return 'var(--bio-emerald, #10b981)';
  if (current > target + 15) return 'var(--acute-ruby, #ef4444)';
  return 'var(--accent-cyan, #06b6d4)';
}

export const AngleGaugeArc: React.FC<AngleGaugeProps> = ({ currentAngle, currentAngleDeg = 0, targetAngle, targetAngleDeg = 90, size = 100 }) => {
  const current = currentAngle ?? currentAngleDeg;
  const target = targetAngle ?? targetAngleDeg;
  const center = size / 2;
  const radius = size * 0.38;
  const clampedAngle = Math.max(0, Math.min(180, current));
  const progressArc = describeArc(center, center, radius, 0, clampedAngle);
  const color = getGaugeColor(current, target);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size}>
        <path d={describeArc(center, center, radius, 0, 180)} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <path d={progressArc} fill="none" stroke={color.includes('var') ? '#06b6d4' : color} strokeWidth="6" strokeLinecap="round" />
      </svg>
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc' }}>{current < 0 ? '--' : Math.round(current)}°</span>
        <div style={{ fontSize: '9px', color: '#94a3b8' }}>TARGET {target}°</div>
      </div>
    </div>
  );
};
