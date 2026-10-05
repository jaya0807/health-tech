import { Landmark3D } from '../../../core/kinematics/types.js';
import { calculateKneeAngle } from '../../../core/kinematics/angleCalculator.js';
import { computeCompositeMqs } from '../../../core/kinematics/motionQualityScore.js';
import { evaluateKinematicVoiceCue } from '../../../core/voice/voiceCoachEvaluator.js';
import { getVoiceCue, SupportedLanguage } from '../../../core/voice/audioFeedbackPresets.js';
import { BiomechanicalRepStateMachine, MovementPhase } from './useWorkoutStateMachine.js';

export interface WorkoutSessionConfig {
  targetAngle: number;
  targetReps: number;
  language?: SupportedLanguage;
}

export interface WorkoutSessionSnapshot {
  currentAngle: number;
  repCount: number;
  targetReps: number;
  currentPhase: MovementPhase;
  mqsScore: number;
  latestCoachMessage: string;
  isCompleted: boolean;
}

export class WorkoutSessionOrchestrator {
  private stateMachine: BiomechanicalRepStateMachine;
  private targetReps: number;
  private language: SupportedLanguage;
  private latestMessage = '';

  constructor(config: WorkoutSessionConfig) {
    this.targetReps = config.targetReps;
    this.language = config.language ?? 'en';
    this.stateMachine = new BiomechanicalRepStateMachine({
      targetAngle: config.targetAngle,
    });
    this.latestMessage = getVoiceCue('START_SESSION', this.language);
  }

  public processFrame(
    hip: Landmark3D,
    knee: Landmark3D,
    ankle: Landmark3D,
    trunkTiltDeg = 0
  ): WorkoutSessionSnapshot {
    const angle = calculateKneeAngle(hip, knee, ankle);
    const mqsBreakdown = computeCompositeMqs({
      actualPeakAngle: angle,
      targetAngle: 90,
      centerOfMassDriftMm: 5,
      normalizedJerk: 10,
      leftRightAngleVarianceDeg: 2,
    });

    const stateResult = this.stateMachine.update(angle, mqsBreakdown.compositeMqs);

    const cueCategory = evaluateKinematicVoiceCue({
      currentAngle: angle,
      targetAngle: 90,
      angularVelocityDegPerSec: 35,
      trunkLateralTiltDeg: trunkTiltDeg,
      currentRep: stateResult.repCount,
      totalTargetReps: this.targetReps,
      isRepCompletedJustNow: stateResult.isRepCompletedJustNow,
      fatigueDetected: false,
    });

    if (cueCategory) {
      const remaining = this.targetReps - stateResult.repCount;
      this.latestMessage = getVoiceCue(cueCategory, this.language, remaining);
    }

    return {
      currentAngle: Number(angle.toFixed(1)),
      repCount: stateResult.repCount,
      targetReps: this.targetReps,
      currentPhase: stateResult.phase,
      mqsScore: mqsBreakdown.compositeMqs,
      latestCoachMessage: this.latestMessage,
      isCompleted: stateResult.repCount >= this.targetReps,
    };
  }
}
