export type MovementPhase = 'IDLE' | 'CONCENTRIC' | 'INFLECTION' | 'ECCENTRIC';

export interface RepCounterConfig {
  targetAngle: number;
  startThresholdAngle?: number;
  minRomToleranceDeg?: number;
  minMqsThreshold?: number;
}

export interface StateMachineUpdateResult {
  phase: MovementPhase;
  repCount: number;
  isRepCompletedJustNow: boolean;
  isRepRejectedJustNow: boolean;
  rejectionReason?: 'INSUFFICIENT_ROM' | 'LOW_MQS';
  peakAngleAchieved: number;
}

export class BiomechanicalRepStateMachine {
  private phase: MovementPhase = 'IDLE';
  private repCount = 0;
  private peakAngle = 0;
  private targetAngle: number;
  private romTolerance: number;
  
  private minDistance = 999;
  private startDistance = -1;

  constructor(config: RepCounterConfig) {
    this.targetAngle = config.targetAngle;
    this.romTolerance = config.minRomToleranceDeg ?? 15.0;
  }

  public update(currentAngle: number, currentMqs: number): StateMachineUpdateResult {
    let isRepCompletedJustNow = false;
    let isRepRejectedJustNow = false;
    let rejectionReason: 'INSUFFICIENT_ROM' | 'LOW_MQS' | undefined;

    const distance = Math.abs(currentAngle - this.targetAngle);

    switch (this.phase) {
      case 'IDLE':
        if (this.startDistance === -1 || distance > this.startDistance) {
          this.startDistance = distance;
        }

        if (this.startDistance > 20 && distance < this.startDistance - 15) {
          this.phase = 'CONCENTRIC';
          this.minDistance = distance;
          this.peakAngle = currentAngle;
        }
        break;

      case 'CONCENTRIC':
        if (distance < this.minDistance) {
          this.minDistance = distance;
          this.peakAngle = currentAngle;
        } else if (distance > this.minDistance + 10.0) {
          if (this.minDistance <= this.romTolerance) {
            this.phase = 'ECCENTRIC';
          } else {
            this.phase = 'IDLE';
            isRepRejectedJustNow = true;
            rejectionReason = 'INSUFFICIENT_ROM';
            this.startDistance = distance;
            this.minDistance = 999;
          }
        }
        break;

      case 'ECCENTRIC':
        if (distance >= this.startDistance - 15.0) {
          this.repCount += 1;
          isRepCompletedJustNow = true;
          this.phase = 'IDLE';
          this.minDistance = 999;
          this.startDistance = distance;
        }
        break;
    }

    return {
      phase: this.phase,
      repCount: this.repCount,
      isRepCompletedJustNow,
      isRepRejectedJustNow,
      rejectionReason,
      peakAngleAchieved: this.peakAngle,
    };
  }

  public reset(): void {
    this.phase = 'IDLE';
    this.repCount = 0;
    this.peakAngle = 0;
    this.minDistance = 999;
    this.startDistance = -1;
  }
}
