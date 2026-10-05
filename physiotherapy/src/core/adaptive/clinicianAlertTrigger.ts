export type AlertSeverity = 'RED_EMERGENCY' | 'YELLOW_WARNING' | 'GREEN_PROGRESS';

export interface ClinicianAlertInput {
  patientId: string;
  patientName: string;
  painVasScore: number;
  currentMqs: number;
  bilateralAsymmetryPercent: number;
  romLossDegrees?: number;
}

export interface ClinicianAlertTicket {
  ticketId: string;
  patientId: string;
  patientName: string;
  severity: AlertSeverity;
  headline: string;
  clinicalDetails: string;
  recommendedAction: string;
  timestamp: string;
}

export function evaluateClinicianAlert(input: ClinicianAlertInput): ClinicianAlertTicket {
  const ticketId = `TICK-${Date.now().toString(36).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // 1. Red Alert (Immediate intervention)
  if (
    input.painVasScore >= 7 ||
    (input.romLossDegrees && input.romLossDegrees >= 25) ||
    input.bilateralAsymmetryPercent >= 35
  ) {
    return {
      ticketId,
      patientId: input.patientId,
      patientName: input.patientName,
      severity: 'RED_EMERGENCY',
      headline: `Critical Biomechanical Alert for ${input.patientName}`,
      clinicalDetails: `Severe pain (VAS ${input.painVasScore}/10) or extreme compensation asymmetry (${input.bilateralAsymmetryPercent}%).`,
      recommendedAction: 'Suspend home exercise program and schedule telehealth follow-up immediately.',
      timestamp,
    };
  }

  // 2. Yellow Warning (Review required)
  if (input.painVasScore >= 4 || input.currentMqs < 60 || input.bilateralAsymmetryPercent >= 20) {
    return {
      ticketId,
      patientId: input.patientId,
      patientName: input.patientName,
      severity: 'YELLOW_WARNING',
      headline: `Sub-optimal Performance / Pain Advisory for ${input.patientName}`,
      clinicalDetails: `Moderate pain (VAS ${input.painVasScore}/10) or reduced movement quality (${input.currentMqs}% MQS).`,
      recommendedAction: 'Review kinematic logs and consider adjusting target ROM or repetition volume.',
      timestamp,
    };
  }

  // 3. Green Progress (Positive milestone)
  return {
    ticketId,
    patientId: input.patientId,
    patientName: input.patientName,
    severity: 'GREEN_PROGRESS',
    headline: `Milestone Achieved: ${input.patientName}`,
    clinicalDetails: `High compliance and pristine movement quality (${input.currentMqs}% MQS, VAS ${input.painVasScore}/10).`,
    recommendedAction: 'Approved for progressive overload advancement in next session.',
    timestamp,
  };
}
