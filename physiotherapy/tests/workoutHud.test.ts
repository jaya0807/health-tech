import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { polarToCartesian, describeArc, getGaugeColor } from '../src/shared/components/AngleGaugeArc.js';
import { calculateMqsRingGeometry } from '../src/shared/components/CircularMqsRing.js';
import { getPainDescriptor } from '../src/shared/components/PainRatingSlider.js';
import { BiomechanicalRepStateMachine } from '../src/features/liveWorkout/hooks/useWorkoutStateMachine.js';
import { WorkoutSessionOrchestrator } from '../src/features/liveWorkout/hooks/useWorkoutSession.js';

describe('Live Workout HUD & AR Guidance Tests', () => {
  describe('1. Floating Angle Gauge & Circular Ring Math', () => {
    test('Converts polar coordinate to cartesian', () => {
      const pt = polarToCartesian(100, 100, 50, 90);
      assert.ok(Math.abs(pt.x - 150) < 0.001);
      assert.ok(Math.abs(pt.y - 100) < 0.001);
    });

    test('Generates valid SVG arc path command', () => {
      const arc = describeArc(60, 60, 40, 0, 90);
      assert.ok(arc.startsWith('M'));
      assert.ok(arc.includes('A 40 40'));
    });

    test('Maps gauge colors by delta from target', () => {
      assert.equal(getGaugeColor(90, 90), 'var(--bio-emerald, #10b981)');
      assert.equal(getGaugeColor(115, 90), 'var(--acute-ruby, #ef4444)');
      assert.equal(getGaugeColor(60, 90), 'var(--accent-cyan, #06b6d4)');
    });

    test('Calculates MQS ring stroke dash offset', () => {
      const ring = calculateMqsRingGeometry(100, 36);
      assert.equal(ring.strokeDashoffset, 0);
      const ringHalf = calculateMqsRingGeometry(50, 36);
      assert.ok(Math.abs(ringHalf.strokeDashoffset - ringHalf.circumference / 2) < 0.001);
    });
  });

  describe('2. Pain VAS Scale Rating', () => {
    test('Returns correct descriptors across pain scale', () => {
      const zero = getPainDescriptor(0);
      assert.equal(zero.emoji, '😀');
      assert.equal(zero.label, 'No Pain');

      const mid = getPainDescriptor(5);
      assert.equal(mid.emoji, '🙁');

      const max = getPainDescriptor(10);
      assert.equal(max.emoji, '🚨');
      assert.equal(max.label, 'Unbearable');
    });
  });

  describe('3. Biomechanical Repetition State Machine', () => {
    test('Successfully counts a full ROM repetition with high MQS', () => {
      const sm = new BiomechanicalRepStateMachine({ targetAngle: 90 });
      sm.update(10, 95); // IDLE
      sm.update(35, 95); // CONCENTRIC start
      sm.update(70, 95); // Rising
      sm.update(92, 95); // Peak achieved
      sm.update(80, 95); // INFLECTION -> ECCENTRIC
      const result = sm.update(15, 95); // Returned to base

      assert.equal(result.repCount, 1);
      assert.equal(result.isRepCompletedJustNow, true);
      assert.equal(result.phase, 'IDLE');
    });

    test('Rejects incomplete repetition when user fails to reach target ROM', () => {
      const sm = new BiomechanicalRepStateMachine({ targetAngle: 90, minRomToleranceDeg: 10 });
      sm.update(10, 95);
      sm.update(35, 95); // CONCENTRIC start
      sm.update(45, 95); // Peak only 45 deg (fails 90-10=80 deg threshold)
      const res = sm.update(30, 95); // Decreasing -> INFLECTION check fails

      assert.equal(res.repCount, 0);
      assert.equal(res.isRepRejectedJustNow, true);
      assert.equal(res.rejectionReason, 'INSUFFICIENT_ROM');
    });

    test('Rejects repetition with low Motion Quality Score', () => {
      const sm = new BiomechanicalRepStateMachine({ targetAngle: 90, minMqsThreshold: 70 });
      sm.update(10, 40);
      sm.update(35, 40);
      sm.update(90, 40); // Peak met
      sm.update(80, 40); // ECCENTRIC
      const res = sm.update(15, 40); // Low MQS (40 < 70)

      assert.equal(res.repCount, 0);
      assert.equal(res.isRepRejectedJustNow, true);
      assert.equal(res.rejectionReason, 'LOW_MQS');
    });
  });

  describe('4. Workout Session Orchestrator', () => {
    test('Processes video frame landmark data and computes snapshot', () => {
      const orch = new WorkoutSessionOrchestrator({ targetAngle: 90, targetReps: 5, language: 'en' });
      const hip = { x: 0.5, y: 0.3, z: 0, visibility: 0.99 };
      const knee = { x: 0.5, y: 0.6, z: 0, visibility: 0.99 };
      const ankle = { x: 0.8, y: 0.6, z: 0, visibility: 0.99 };

      const snap = orch.processFrame(hip, knee, ankle, 0);
      assert.equal(snap.targetReps, 5);
      assert.equal(snap.currentAngle, 90);
      assert.ok(snap.mqsScore > 0);
      assert.ok(snap.latestCoachMessage.length > 0);
    });
  });
});
