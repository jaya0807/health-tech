export interface SoapReportInput {
  patientId: string;
  patientName: string;
  condition: string;
  clinicianName: string;
  painVas: number;
  meanPeakRomDeg: number;
  targetRomDeg: number;
  averageMqs: number;
  bilateralSymmetryPercent: number;
  completedReps: number;
  targetReps: number;
  activeDaysRecordedInMonth: number;
}

export interface SoapClinicalNote {
  header: {
    reportId: string;
    patientId: string;
    patientName: string;
    generatedAt: string;
    cptCodes: string[];
  };
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export function generateSoapClinicalNote(input: SoapReportInput): SoapClinicalNote {
  const reportId = `SOAP-${Date.now().toString(36).toUpperCase()}`;
  const generatedAt = new Date().toISOString();

  // RTM Billing codes
  const cptCodes = ['CPT-98975'];
  if (input.activeDaysRecordedInMonth >= 16) {
    cptCodes.push('CPT-98977'); // Remote Therapeutic Monitoring: 16+ days recorded
  }

  const subjective = `Patient reports current pain VAS of ${input.painVas}/10 during active rehabilitation for ${input.condition}.`;
  const objective = `Recorded Mean Peak ROM: ${input.meanPeakRomDeg}° (Target: ${input.targetRomDeg}°). Motion Quality Score: ${input.averageMqs}%. Bilateral Symmetry: ${input.bilateralSymmetryPercent}%. Completed ${input.completedReps}/${input.targetReps} reps.`;
  
  const mqsTier = input.averageMqs >= 85 ? 'Excellent' : input.averageMqs >= 70 ? 'Adequate' : 'Sub-optimal';
  const assessment = `Patient demonstrates ${mqsTier} biomechanical kinematics. Active monitoring logged ${input.activeDaysRecordedInMonth} days this billing cycle.`;

  const nextAction = input.averageMqs >= 85 && input.painVas <= 2
    ? 'Promote target ROM by +5° and increase volume by +2 reps.'
    : input.painVas >= 5
    ? 'Regress ROM target by 5° to manage acute pain flare.'
    : 'Maintain current protocol for continued neuromuscular consolidation.';

  const plan = `1. Continue home AI guidance sessions. 2. ${nextAction} 3. Telehealth review scheduled in 14 days.`;

  return {
    header: { reportId, patientId: input.patientId, patientName: input.patientName, generatedAt, cptCodes },
    subjective,
    objective,
    assessment,
    plan,
  };
}
