export interface InsuranceAuditInput {
  patientId: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  activeSessionDays: number;
  averageSessionDurationMin: number;
  totalPrescribedSessions: number;
}

export interface InsuranceAuditResult {
  reimbursementStatus: 'QUALIFIED' | 'PENDING_MORE_DAYS' | 'NON_COMPLIANT';
  eligibleCptCodes: string[];
  daysRemainingToQualify: number;
  complianceRatePercent: number;
  auditRemarks: string;
}

export function auditRtmReimbursement(input: InsuranceAuditInput): InsuranceAuditResult {
  const complianceRate = Math.round((input.activeSessionDays / Math.max(1, input.totalPrescribedSessions)) * 100);
  const daysNeededFor98977 = 16;
  const daysRemaining = Math.max(0, daysNeededFor98977 - input.activeSessionDays);

  const eligibleCptCodes: string[] = ['CPT-98975']; // Setup always eligible if enrolled

  if (input.activeSessionDays >= daysNeededFor98977) {
    eligibleCptCodes.push('CPT-98977');
    if (input.averageSessionDurationMin >= 20) {
      eligibleCptCodes.push('CPT-98980'); // First 20 mins clinical review
    }
    return {
      reimbursementStatus: 'QUALIFIED',
      eligibleCptCodes,
      daysRemainingToQualify: 0,
      complianceRatePercent: complianceRate,
      auditRemarks: `Patient met CMS requirement with ${input.activeSessionDays} active recording days.`,
    };
  }

  if (input.activeSessionDays >= 8) {
    return {
      reimbursementStatus: 'PENDING_MORE_DAYS',
      eligibleCptCodes,
      daysRemainingToQualify: daysRemaining,
      complianceRatePercent: complianceRate,
      auditRemarks: `Pending qualification. Requires ${daysRemaining} additional active days to claim CPT-98977.`,
    };
  }

  return {
    reimbursementStatus: 'NON_COMPLIANT',
    eligibleCptCodes: [],
    daysRemainingToQualify: daysRemaining,
    complianceRatePercent: complianceRate,
    auditRemarks: `Non-compliant: Only ${input.activeSessionDays} days recorded in 30-day cycle.`,
  };
}
