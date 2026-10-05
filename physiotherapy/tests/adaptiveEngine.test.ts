import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { adaptPrescriptionByPain } from '../src/core/adaptive/painBiofeedback.js';
import { evaluateBiomechanicalFatigue } from '../src/core/adaptive/fatigueDetector.js';
import { evaluateProgressiveDifficulty } from '../src/core/adaptive/dynamicDifficultyAdjustment.js';
import { evaluateClinicianAlert } from '../src/core/adaptive/clinicianAlertTrigger.js';

describe('Adaptive Intelligence & Safety Engine Tests', () => {
  describe('1. Pain Biofeedback Prescription Modifier', () => {
    test('Maintains baseline prescription when pain is mild (VAS 2)', () => {
      const res = adaptPrescriptionByPain({
        currentPainScore: 2,
        initialTargetAngleDeg: 90,
        initialTargetReps: 10,
        completedReps: 3,
      });
      assert.equal(res.emergencyHalt, false);
      assert.equal(res.adaptedTargetAngleDeg, 90);
      assert.equal(res.adaptedTargetReps, 10);
    });

    test('Scales down ROM and reps for moderate pain (VAS 5)', () => {
      const res = adaptPrescriptionByPain({
        currentPainScore: 5,
        initialTargetAngleDeg: 90,
        initialTargetReps: 10,
        completedReps: 2,
      });
      assert.equal(res.emergencyHalt, false);
      assert.equal(res.adaptedTargetAngleDeg, 75); // 90 - 15
      assert.equal(res.adaptedTargetReps, 8); // round(10 * 0.8)
    });

    test('Triggers immediate emergency halt for severe pain (VAS 8)', () => {
      const res = adaptPrescriptionByPain({
        currentPainScore: 8,
        initialTargetAngleDeg: 90,
        initialTargetReps: 10,
        completedReps: 4,
      });
      assert.equal(res.emergencyHalt, true);
      assert.equal(res.requiresRest, true);
      assert.ok(res.clinicalNote.includes('EMERGENCY_HALT'));
    });
  });

  describe('2. Biomechanical Fatigue & Tremor Evaluation', () => {
    test('Calculates low fatigue during baseline execution', () => {
      const res = evaluateBiomechanicalFatigue({
        baselineVelocityDegPerSec: 40,
        currentVelocityDegPerSec: 38,
        baselineNormalizedJerk: 10,
        currentNormalizedJerk: 11,
        bilateralAsymmetryPercent: 4,
      });
      assert.equal(res.isFatigued, false);
      assert.equal(res.requiresRest, false);
    });

    test('Detects significant fatigue from velocity decay and tremor jerk', () => {
      const res = evaluateBiomechanicalFatigue({
        baselineVelocityDegPerSec: 50,
        currentVelocityDegPerSec: 20, // 60% drop
        baselineNormalizedJerk: 10,
        currentNormalizedJerk: 35, // 3.5x spike
        bilateralAsymmetryPercent: 18,
      });
      assert.equal(res.isFatigued, true);
      assert.equal(res.requiresRest, true);
      assert.ok(res.restDurationSec >= 60);
    });
  });

  describe('3. Dynamic Difficulty Adjustment (DDA)', () => {
    test('Promotes patient after 3 high-quality, low-pain sessions', () => {
      const res = evaluateProgressiveDifficulty({
        currentStageTier: 2,
        currentTargetAngleDeg: 90,
        currentTargetReps: 10,
        maxAnatomicalLimitDeg: 120,
        sessionHistory: [
          { sessionId: '1', averageMqs: 90, averagePainVas: 1, completedRepFraction: 1 },
          { sessionId: '2', averageMqs: 88, averagePainVas: 2, completedRepFraction: 1 },
          { sessionId: '3', averageMqs: 92, averagePainVas: 1, completedRepFraction: 1 },
        ],
      });
      assert.equal(res.action, 'PROMOTE');
      assert.equal(res.newStageTier, 3);
      assert.equal(res.newTargetAngleDeg, 95); // 90 + 5
      assert.equal(res.newTargetReps, 12); // 10 + 2
    });

    test('Regresses difficulty upon pain flare-up', () => {
      const res = evaluateProgressiveDifficulty({
        currentStageTier: 3,
        currentTargetAngleDeg: 95,
        currentTargetReps: 12,
        maxAnatomicalLimitDeg: 120,
        sessionHistory: [{ sessionId: '1', averageMqs: 55, averagePainVas: 6, completedRepFraction: 0.5 }],
      });
      assert.equal(res.action, 'REGRESS');
      assert.equal(res.newStageTier, 2);
      assert.equal(res.newTargetAngleDeg, 90);
    });
  });

  describe('4. Clinician Alert Escalation Matrix', () => {
    test('Generates RED_EMERGENCY ticket for severe clinical risk', () => {
      const ticket = evaluateClinicianAlert({
        patientId: 'PT-101',
        patientName: 'John Doe',
        painVasScore: 8,
        currentMqs: 45,
        bilateralAsymmetryPercent: 40,
      });
      assert.equal(ticket.severity, 'RED_EMERGENCY');
      assert.ok(ticket.ticketId.startsWith('TICK-'));
    });

    test('Generates GREEN_PROGRESS ticket for pristine recovery', () => {
      const ticket = evaluateClinicianAlert({
        patientId: 'PT-101',
        patientName: 'John Doe',
        painVasScore: 1,
        currentMqs: 92,
        bilateralAsymmetryPercent: 3,
      });
      assert.equal(ticket.severity, 'GREEN_PROGRESS');
    });
  });
});
