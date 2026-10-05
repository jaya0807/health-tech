import React from 'react';
import { Activity, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface PainLevelDescriptor {
  score: number;
  emoji: string;
  label: string;
  color: string;
}

export const PAIN_LEVEL_DESCRIPTORS: Record<number, PainLevelDescriptor> = {
  0: { score: 0, emoji: '😀', label: 'No Pain', color: '#10b981' },
  1: { score: 1, emoji: '🙂', label: 'Very Mild', color: '#10b981' },
  2: { score: 2, emoji: '🙂', label: 'Mild', color: '#10b981' },
  3: { score: 3, emoji: '😐', label: 'Uncomfortable', color: '#f59e0b' },
  4: { score: 4, emoji: '😐', label: 'Moderate', color: '#f59e0b' },
  5: { score: 5, emoji: '🙁', label: 'Moderate Pain', color: '#f59e0b' },
  6: { score: 6, emoji: '😣', label: 'Distressing', color: '#ef4444' },
  7: { score: 7, emoji: '😣', label: 'Severe', color: '#ef4444' },
  8: { score: 8, emoji: '😫', label: 'Intense', color: '#ef4444' },
  9: { score: 9, emoji: '😭', label: 'Excruciating', color: '#ef4444' },
  10: { score: 10, emoji: '🚨', label: 'Unbearable', color: '#ef4444' },
};

export function getPainDescriptor(score: number): PainLevelDescriptor {
  const rounded = Math.max(0, Math.min(10, Math.round(score)));
  return PAIN_LEVEL_DESCRIPTORS[rounded] ?? PAIN_LEVEL_DESCRIPTORS[0];
}

interface PainRatingSliderProps {
  painScore: number;
  onPainChange: (val: number) => void;
}

export const PainRatingSlider: React.FC<PainRatingSliderProps> = ({ painScore, onPainChange }) => {
  const desc = getPainDescriptor(painScore);
  const getIcon = () => {
    if (painScore <= 2) return <ShieldCheck size={16} color="#10b981" />;
    if (painScore <= 5) return <AlertTriangle size={16} color="#f59e0b" />;
    return <AlertCircle size={16} color="#ef4444" />;
  };

  return (
    <div className="glass-panel" style={{ padding: '14px 20px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={15} color="#ffffff" /> Pain & Comfort Level:
        </span>
        <span style={{ color: desc.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
          {getIcon()} {desc.label} ({painScore}/10)
        </span>
      </div>
      <input type="range" min="0" max="10" value={painScore} onChange={(e) => onPainChange(Number(e.target.value))} style={{ width: '100%', accentColor: desc.color }} />
    </div>
  );
};
