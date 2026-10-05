import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateKneeAngle } from '../src/core/kinematics/angleCalculator.js';
import { computeCompositeMqs } from '../src/core/kinematics/motionQualityScore.js';
import { adaptPrescriptionByPain } from '../src/core/adaptive/painBiofeedback.js';
import { evaluateProgressiveDifficulty } from '../src/core/adaptive/dynamicDifficultyAdjustment.js';
import { calculateJointStress } from '../src/core/digitalTwin/jointStressHeatmap.js';
import { generateSoapClinicalNote } from '../src/core/reporting/clinicalReportGenerator.js';
import { auditRtmReimbursement } from '../src/core/reporting/insuranceAuditor.js';

describe('End-to-End Autonomous AI Physiotherapy Integration', () => {
  test('Complete Patient Rehabilitation Lifecycle Simulation', () => {
    // 1. Biomechanical Rep Calculation
    const hip = { x: 0, y: 1.0, z: 0, visibility: 1 };
    const knee = { x: 0, y: 0.5, z: 0, visibility: 1 };
    const ankle = { x: 0.5, y: 0.5, z: 0, visibility: 1 }; // 90 degree flexion
    const angle = calculateKneeAngle(hip, knee, ankle);
    assert.equal(angle, 90.0);

    // 2. 4D Motion Quality Scoring
    const mqsResult = computeCompositeMqs({
      actualPeakAngle: angle,
      targetAngle: 90.0,
      centerOfMassDriftMm: 5.0,
      normalizedJerk: 10.0,
      leftRightAngleVarianceDeg: 2.0,
    });
    assert.ok(mqsResult.compositeMqs >= 85.0);

    // 3. Pain Adaptation Check (VAS 2)
    const painResult = adaptPrescriptionByPain({
      currentPainScore: 2,
      initialTargetAngleDeg: 90,
      initialTargetReps: 10,
      completedReps: 10,
    });
    assert.equal(painResult.emergencyHalt, false);

    // 4. Dynamic Difficulty Adjustment (3-session streak)
    const ddaResult = evaluateProgressiveDifficulty({
      currentStageTier: 1,
      currentTargetAngleDeg: 90,
      currentTargetReps: 10,
      maxAnatomicalLimitDeg: 125,
      sessionHistory: [
        { sessionId: '1', averageMqs: 88, averagePainVas: 1, completedRepFraction: 1.0 },
        { sessionId: '2', averageMqs: 90, averagePainVas: 2, completedRepFraction: 1.0 },
        { sessionId: '3', averageMqs: 92, averagePainVas: 1, completedRepFraction: 1.0 },
      ],
    });
    assert.equal(ddaResult.action, 'PROMOTE');
    assert.equal(ddaResult.newTargetAngleDeg, 95);

    // 5. 3D Digital Twin Joint Stress
    const stress = calculateJointStress({
      jointAngleDeg: 90,
      angularAccelerationDegPerSec2: 15,
      segmentMassKg: 4.5,
      segmentLengthM: 0.45,
    });
    assert.equal(stress.stressTier, 'LOW');

    // 6. SOAP Clinical Report Generation
    const soapNote = generateSoapClinicalNote({
      patientId: 'PT-ACL-88',
      patientName: 'Alex Rivera',
      condition: 'ACL Reconstruction',
      clinicianName: 'Dr. Sarah Jenkins, PT',
      painVas: 2,
      meanPeakRomDeg: 90,
      targetRomDeg: 90,
      averageMqs: mqsResult.compositeMqs,
      bilateralSymmetryPercent: 95,
      completedReps: 10,
      targetReps: 10,
      activeDaysRecordedInMonth: 18,
    });
    assert.ok(soapNote.header.cptCodes.includes('CPT-98977'));

    // 7. CMS Insurance Reimbursement Audit
    const audit = auditRtmReimbursement({
      patientId: 'PT-ACL-88',
      billingPeriodStart: '2026-08-01',
      billingPeriodEnd: '2026-08-30',
      activeSessionDays: 18,
      averageSessionDurationMin: 22,
      totalPrescribedSessions: 20,
    });
    assert.equal(audit.reimbursementStatus, 'QUALIFIED');
  });
});
