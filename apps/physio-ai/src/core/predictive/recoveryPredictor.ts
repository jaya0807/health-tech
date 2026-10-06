export interface RecoveryForecastInput {
  startingRomDeg: number;
  targetMilestoneRomDeg: number;
  fullRecoveryRomDeg: number;
  complianceFraction: number; // 0.0 - 1.0
  remodelingRateConstant?: number; // default ~0.12 per week
}

export interface TrajectoryPoint {
  week: number;
  projectedRomDeg: number;
}

export interface RecoveryForecastResult {
  estimatedWeeksToMilestone: number;
  forecastTrajectory: TrajectoryPoint[];
  milestoneAchievable: boolean;
}

export function projectRecoveryTrajectory(input: RecoveryForecastInput): RecoveryForecastResult {
  const r0 = input.startingRomDeg;
  const rInf = input.fullRecoveryRomDeg;
  const k = input.remodelingRateConstant ?? 0.12;
  const c = Math.max(0.1, Math.min(1.0, input.complianceFraction));
  const effectiveK = k * c;

  const trajectory: TrajectoryPoint[] = [];
  let estimatedWeeks = -1;

  for (let week = 0; week <= 16; week++) {
    // R(t) = R0 + (Rinf - R0) * (1 - exp(-k * c * t))
    const rom = r0 + (rInf - r0) * (1 - Math.exp(-effectiveK * week));
    trajectory.push({
      week,
      projectedRomDeg: Number(rom.toFixed(1)),
    });

    if (estimatedWeeks === -1 && rom >= input.targetMilestoneRomDeg) {
      estimatedWeeks = week;
    }
  }

  return {
    estimatedWeeksToMilestone: estimatedWeeks !== -1 ? estimatedWeeks : 16,
    forecastTrajectory: trajectory,
    milestoneAchievable: estimatedWeeks !== -1,
  };
}
