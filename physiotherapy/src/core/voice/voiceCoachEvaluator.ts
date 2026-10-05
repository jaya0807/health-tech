import { VoiceCueCategory } from './audioFeedbackPresets.js';

export interface KinematicStateInput {
  currentAngle: number;
  targetAngle: number;
  angularVelocityDegPerSec: number;
  trunkLateralTiltDeg: number;
  currentRep: number;
  totalTargetReps: number;
  isRepCompletedJustNow: boolean;
  fatigueDetected: boolean;
  maxTolerableVelocityDegPerSec?: number;
}

export function evaluateKinematicVoiceCue(input: KinematicStateInput): VoiceCueCategory | null {
  if (input.fatigueDetected) {
    return 'FATIGUE_REST';
  }

  // Check if session finished
  if (input.isRepCompletedJustNow && input.currentRep >= input.totalTargetReps) {
    return 'SESSION_COMPLETE';
  }

  // Check if rep was completed
  if (input.isRepCompletedJustNow) {
    const remaining = input.totalTargetReps - input.currentRep;
    if (remaining > 0 && remaining <= 3) {
      return 'REPS_REMAINING';
    }
    return 'EXCELLENT_REP';
  }

  // Check posture: excessive trunk tilt (> 12 deg)
  if (Math.abs(input.trunkLateralTiltDeg) > 12.0) {
    return 'STRAIGHTEN_BACK';
  }

  // Check speed: moving too fast (> 180 deg/s)
  const maxVelocity = input.maxTolerableVelocityDegPerSec ?? 180.0;
  if (Math.abs(input.angularVelocityDegPerSec) > maxVelocity) {
    return 'SLOW_DOWN';
  }

  // Check over-extension / hyper-flexion (+15 deg past target)
  if (input.currentAngle > input.targetAngle + 15.0) {
    return 'OVER_FLEXION';
  }

  // Check under-flexion if in inflection zone but short by > 15 deg
  if (input.currentAngle < input.targetAngle - 15.0 && input.currentAngle > input.targetAngle * 0.4) {
    return 'BEND_MORE';
  }

  return null;
}
