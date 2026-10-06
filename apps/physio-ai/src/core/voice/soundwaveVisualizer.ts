export interface SoundwaveFrame {
  bars: number[]; // Array of normalized bar heights [0.0 - 1.0]
  isActive: boolean;
}

/**
 * Generates dynamic audio bar heights for glowing HUD soundwave visualization.
 */
export function generateSoundwaveBars(
  barCount = 16,
  timeSec: number,
  isSpeaking: boolean,
  baseFrequency = 4.0
): SoundwaveFrame {
  if (!isSpeaking) {
    return {
      bars: new Array(barCount).fill(0.15),
      isActive: false,
    };
  }

  const bars = Array.from({ length: barCount }, (_, i) => {
    const phase = (i / barCount) * Math.PI * 2;
    const wave1 = Math.sin(timeSec * baseFrequency + phase);
    const wave2 = Math.cos(timeSec * (baseFrequency * 1.5) + phase * 0.5);
    const combined = Math.abs(wave1 * 0.6 + wave2 * 0.4);
    return Math.max(0.2, Math.min(1.0, combined));
  });

  return {
    bars,
    isActive: true,
  };
}
