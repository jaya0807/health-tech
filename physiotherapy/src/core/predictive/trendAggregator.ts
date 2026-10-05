export interface DailySessionMetric {
  date: string; // YYYY-MM-DD
  maxRomDeg: number;
  compositeMqs: number;
  painVas: number;
  bilateralSymmetryPercent: number;
}

export interface LongitudinalTrendSummary {
  sevenDayAvgRomDeg: number;
  sevenDayAvgMqs: number;
  sevenDayAvgPain: number;
  totalRomGainDeg: number;
  totalPainReduction: number;
  weeklyRomVelocityDeg: number;
}

export function aggregateLongitudinalTrends(sessions: DailySessionMetric[]): LongitudinalTrendSummary {
  if (sessions.length === 0) {
    return {
      sevenDayAvgRomDeg: 0,
      sevenDayAvgMqs: 0,
      sevenDayAvgPain: 0,
      totalRomGainDeg: 0,
      totalPainReduction: 0,
      weeklyRomVelocityDeg: 0,
    };
  }

  const sorted = [...sessions].sort((a, b) => a.date.localeCompare(b.date));
  const recent7 = sorted.slice(-7);

  const sum7Rom = recent7.reduce((acc, s) => acc + s.maxRomDeg, 0);
  const sum7Mqs = recent7.reduce((acc, s) => acc + s.compositeMqs, 0);
  const sum7Pain = recent7.reduce((acc, s) => acc + s.painVas, 0);

  const first = sorted[0];
  const last = sorted[sorted.length - 1];

  const totalRomGain = Math.max(0, last.maxRomDeg - first.maxRomDeg);
  const totalPainReduction = Math.max(0, first.painVas - last.painVas);

  const daysElapsed = Math.max(1, (new Date(last.date).getTime() - new Date(first.date).getTime()) / (1000 * 3600 * 24));
  const weeksElapsed = daysElapsed / 7.0;
  const weeklyVelocity = Number((totalRomGain / weeksElapsed).toFixed(2));

  return {
    sevenDayAvgRomDeg: Number((sum7Rom / recent7.length).toFixed(1)),
    sevenDayAvgMqs: Number((sum7Mqs / recent7.length).toFixed(1)),
    sevenDayAvgPain: Number((sum7Pain / recent7.length).toFixed(1)),
    totalRomGainDeg: Number(totalRomGain.toFixed(1)),
    totalPainReduction: Number(totalPainReduction.toFixed(1)),
    weeklyRomVelocityDeg: weeklyVelocity,
  };
}
