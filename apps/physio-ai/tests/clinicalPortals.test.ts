import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { hasPermission } from '../src/features/portal/types.js';
import { generateSoapClinicalNote } from '../src/core/reporting/clinicalReportGenerator.js';
import { auditRtmReimbursement } from '../src/core/reporting/insuranceAuditor.js';

describe('Clinical Dashboard & Multi-Role Portal Tests', () => {
  describe('1. Role-Based Access Control (RBAC)', () => {
    test('Grants appropriate permissions to physiotherapists', () => {
      assert.equal(hasPermission('PHYSIOTHERAPIST', 'VIEW_PATIENT_COHORT'), true);
      assert.equal(hasPermission('PHYSIOTHERAPIST', 'EDIT_PRESCRIPTION'), true);
      assert.equal(hasPermission('PHYSIOTHERAPIST', 'MANAGE_CLINIC_USERS'), false);
    });

    test('Restricts patients to personal telemetry only', () => {
      assert.equal(hasPermission('PATIENT', 'VIEW_OWN_TELEMETRY'), true);
      assert.equal(hasPermission('PATIENT', 'VIEW_PATIENT_COHORT'), false);
      assert.equal(hasPermission('PATIENT', 'EDIT_PRESCRIPTION'), false);
    });

    test('Enables clinic admins to manage clinic users and billing', () => {
      assert.equal(hasPermission('CLINIC_ADMIN', 'MANAGE_CLINIC_USERS'), true);
      assert.equal(hasPermission('CLINIC_ADMIN', 'EXPORT_RTM_BILLING'), true);
    });
  });

  describe('2. Automated SOAP Clinical Note Generator', () => {
    test('Generates complete SOAP report with CPT billing codes', () => {
      const note = generateSoapClinicalNote({
        patientId: 'PT-101',
        patientName: 'Jane Smith',
        condition: 'ACL Reconstruction',
        clinicianName: 'Dr. Watson, DPT',
        painVas: 2,
        meanPeakRomDeg: 95,
        targetRomDeg: 90,
        averageMqs: 88,
        bilateralSymmetryPercent: 91,
        completedReps: 10,
        targetReps: 10,
        activeDaysRecordedInMonth: 18,
      });

      assert.ok(note.header.reportId.startsWith('SOAP-'));
      assert.ok(note.header.cptCodes.includes('CPT-98975'));
      assert.ok(note.header.cptCodes.includes('CPT-98977')); // >= 16 days
      assert.ok(note.subjective.includes('VAS of 2/10'));
      assert.ok(note.objective.includes('95°'));
      assert.ok(note.assessment.includes('Excellent'));
      assert.ok(note.plan.includes('Promote target ROM'));
    });
  });

  describe('3. CMS Remote Therapeutic Monitoring Insurance Auditor', () => {
    test('Qualifies patient with 18 active transmission days', () => {
      const res = auditRtmReimbursement({
        patientId: 'PT-101',
        billingPeriodStart: '2026-08-01',
        billingPeriodEnd: '2026-08-30',
        activeSessionDays: 18,
        averageSessionDurationMin: 22,
        totalPrescribedSessions: 20,
      });
      assert.equal(res.reimbursementStatus, 'QUALIFIED');
      assert.equal(res.daysRemainingToQualify, 0);
      assert.ok(res.eligibleCptCodes.includes('CPT-98977'));
      assert.ok(res.eligibleCptCodes.includes('CPT-98980'));
    });

    test('Identifies pending qualification when short of 16 days', () => {
      const res = auditRtmReimbursement({
        patientId: 'PT-102',
        billingPeriodStart: '2026-08-01',
        billingPeriodEnd: '2026-08-30',
        activeSessionDays: 11,
        averageSessionDurationMin: 15,
        totalPrescribedSessions: 20,
      });
      assert.equal(res.reimbursementStatus, 'PENDING_MORE_DAYS');
      assert.equal(res.daysRemainingToQualify, 5); // 16 - 11
    });

    test('Disqualifies non-compliant patients (< 8 days)', () => {
      const res = auditRtmReimbursement({
        patientId: 'PT-103',
        billingPeriodStart: '2026-08-01',
        billingPeriodEnd: '2026-08-30',
        activeSessionDays: 3,
        averageSessionDurationMin: 10,
        totalPrescribedSessions: 20,
      });
      assert.equal(res.reimbursementStatus, 'NON_COMPLIANT');
    });
  });
});
