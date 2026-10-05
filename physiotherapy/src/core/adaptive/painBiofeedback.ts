export interface PainAdaptationInput {
  currentPainScore: number; // 0 - 10 VAS
  initialTargetAngleDeg: number;
  initialTargetReps: number;
  completedReps: number;
}

export interface PainAdaptationResult {
  adaptedTargetAngleDeg: number;
  adaptedTargetReps: number;
  emergencyHalt: boolean;
  requiresRest: boolean;
  clinicalNote: string;
}

export function adaptPrescriptionByPain(input: PainAdaptationInput): PainAdaptationResult {
  const pain = Math.max(0, Math.min(10, input.currentPainScore));

  // Severe Pain (7-10): Emergency Stop
  if (pain >= 7) {
    return {
      adaptedTargetAngleDeg: input.initialTargetAngleDeg,
      adaptedTargetReps: input.completedReps,
      emergencyHalt: true,
      requiresRest: true,
      clinicalNote: `EMERGENCY_HALT: Patient reported severe acute pain (VAS ${pain}/10). Session terminated for safety.`,
    };
  }

  // Moderate Pain (4-6): Reduce ROM and Reps
  if (pain >= 4) {
    const reducedAngle = Math.max(30, input.initialTargetAngleDeg - 15);
    const reducedReps = Math.max(input.completedReps + 1, Math.round(input.initialTargetReps * 0.8));
    return {
      adaptedTargetAngleDeg: reducedAngle,
      adaptedTargetReps: reducedReps,
      emergencyHalt: false,
      requiresRest: false,
      clinicalNote: `MODERATE_ADAPTATION: Target ROM decreased by 15° and reps scaled down to ${reducedReps} due to VAS ${pain}/10.`,
    };
  }

  // Mild / No Pain (0-3): Safe baseline
  return {
    adaptedTargetAngleDeg: input.initialTargetAngleDeg,
    adaptedTargetReps: input.initialTargetReps,
    emergencyHalt: false,
    requiresRest: false,
    clinicalNote: 'NORMAL_INTENSITY: Patient within comfort threshold (VAS ≤ 3/10).',
  };
}
