import React, { useState, useEffect } from 'react';
import { generateSoundwaveBars, SoundwaveFrame } from '../../core/voice/soundwaveVisualizer.js';

export interface VoiceWaveformProps {
  isSpeaking: boolean;
  timeSec?: number;
  barCount?: number;
}

export function computeSoundwave(isSpeaking: boolean, timeSec: number, barCount = 14): SoundwaveFrame {
  return generateSoundwaveBars(barCount, timeSec, isSpeaking);
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isSpeaking, barCount = 12 }) => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setT((prev) => prev + 0.1), 50);
    return () => clearInterval(id);
  }, []);

  const frame = generateSoundwaveBars(barCount, t, isSpeaking);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '28px', padding: '0 8px' }}>
      {frame.bars.map((bar, idx) => (
        <span
          key={idx}
          style={{
            width: '3px',
            height: `${Math.max(15, bar * 100)}%`,
            background: isSpeaking ? 'linear-gradient(to top, #27272a, #10b981)' : '#334155',
            borderRadius: '2px',
            transition: 'height 0.08s ease',
          }}
        />
      ))}
    </div>
  );
};
