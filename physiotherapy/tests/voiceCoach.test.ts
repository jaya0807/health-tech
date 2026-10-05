import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { getVoiceCue } from '../src/core/voice/audioFeedbackPresets.js';
import { SpeechSynthesizerEngine } from '../src/core/voice/speechSynthesizer.js';
import { evaluateKinematicVoiceCue } from '../src/core/voice/voiceCoachEvaluator.js';
import { parseVoiceCommand, triageConversationalPain } from '../src/core/voice/speechRecognizer.js';
import { generateSoundwaveBars } from '../src/core/voice/soundwaveVisualizer.js';

describe('Voice Coach & Conversational AI Tests', () => {
  describe('1. Multilingual Audio Cue Dictionary', () => {
    test('Fetches English prompt with dynamic count injection', () => {
      const cue = getVoiceCue('REPS_REMAINING', 'en', 3);
      assert.equal(cue, 'Only 3 more repetitions to go.');
    });

    test('Fetches Hindi prompt correctly', () => {
      const cue = getVoiceCue('EXCELLENT_REP', 'hi');
      assert.equal(cue, 'बहुत बढ़िया! बिल्कुल सही तरीका।');
    });

    test('Fetches Odia prompt correctly', () => {
      const cue = getVoiceCue('START_SESSION', 'or');
      assert.equal(cue, 'ଆସନ୍ତୁ ଆପଣଙ୍କର ଥେରାପି ଅଧିବେଶନ ଆରମ୍ଭ କରିବା।');
    });

    test('Fetches Tamil and Telugu cues', () => {
      assert.ok(getVoiceCue('FATIGUE_REST', 'ta').length > 0);
      assert.ok(getVoiceCue('FATIGUE_REST', 'te').length > 0);
    });

    test('Fetches Spanish prompt with count', () => {
      const cue = getVoiceCue('REPS_REMAINING', 'es', 2);
      assert.equal(cue, 'Solo quedan 2 repeticiones.');
    });
  });

  describe('2. Kinematic Voice Coach Rule Evaluator', () => {
    test('Triggers BEND_MORE when flexion is insufficient', () => {
      const cue = evaluateKinematicVoiceCue({
        currentAngle: 60,
        targetAngle: 90,
        angularVelocityDegPerSec: 30,
        trunkLateralTiltDeg: 2,
        currentRep: 3,
        totalTargetReps: 10,
        isRepCompletedJustNow: false,
        fatigueDetected: false,
      });
      assert.equal(cue, 'BEND_MORE');
    });

    test('Triggers SLOW_DOWN when moving too fast', () => {
      const cue = evaluateKinematicVoiceCue({
        currentAngle: 80,
        targetAngle: 90,
        angularVelocityDegPerSec: 240, // > 180 deg/s
        trunkLateralTiltDeg: 2,
        currentRep: 3,
        totalTargetReps: 10,
        isRepCompletedJustNow: false,
        fatigueDetected: false,
      });
      assert.equal(cue, 'SLOW_DOWN');
    });

    test('Triggers STRAIGHTEN_BACK when trunk tilts laterally', () => {
      const cue = evaluateKinematicVoiceCue({
        currentAngle: 85,
        targetAngle: 90,
        angularVelocityDegPerSec: 40,
        trunkLateralTiltDeg: 15, // > 12 deg
        currentRep: 3,
        totalTargetReps: 10,
        isRepCompletedJustNow: false,
        fatigueDetected: false,
      });
      assert.equal(cue, 'STRAIGHTEN_BACK');
    });

    test('Triggers REPS_REMAINING countdown when 2 reps left', () => {
      const cue = evaluateKinematicVoiceCue({
        currentAngle: 90,
        targetAngle: 90,
        angularVelocityDegPerSec: 30,
        trunkLateralTiltDeg: 0,
        currentRep: 8,
        totalTargetReps: 10,
        isRepCompletedJustNow: true,
        fatigueDetected: false,
      });
      assert.equal(cue, 'REPS_REMAINING');
    });

    test('Triggers FATIGUE_REST when fatigue detected', () => {
      const cue = evaluateKinematicVoiceCue({
        currentAngle: 90,
        targetAngle: 90,
        angularVelocityDegPerSec: 30,
        trunkLateralTiltDeg: 0,
        currentRep: 4,
        totalTargetReps: 10,
        isRepCompletedJustNow: false,
        fatigueDetected: true,
      });
      assert.equal(cue, 'FATIGUE_REST');
    });
  });

  describe('3. Speech Synthesizer Cooldown & Priority', () => {
    test('Suppresses duplicate cues within cooldown window', () => {
      const synth = new SpeechSynthesizerEngine();
      const first = synth.speak({ id: '1', text: 'Bend your knee', priority: 'NORMAL', timestampMs: 1000 });
      const duplicate = synth.speak({ id: '2', text: 'Bend your knee', priority: 'NORMAL', timestampMs: 1500 });
      assert.equal(first, true);
      assert.equal(duplicate, false);
    });

    test('HIGH priority speech bypasses cooldown', () => {
      const synth = new SpeechSynthesizerEngine();
      synth.speak({ id: '1', text: 'Slow down', priority: 'NORMAL', timestampMs: 1000 });
      const urgent = synth.speak({ id: '2', text: 'Emergency halt', priority: 'HIGH', timestampMs: 1200 });
      assert.equal(urgent, true);
    });
  });

  describe('4. Voice Command Recognition & Pain Triage', () => {
    test('Parses hands-free voice commands', () => {
      assert.equal(parseVoiceCommand('Please pause the workout'), 'PAUSE');
      assert.equal(parseVoiceCommand('I am ready to start'), 'START');
      assert.equal(parseVoiceCommand('Emergency help me'), 'HELP');
    });

    test('Triages conversational pain descriptions', () => {
      const severe = triageConversationalPain('I felt a sharp pain in my knee');
      assert.equal(severe.severity, 'SEVERE');
      assert.equal(severe.suggestedAction, 'PAUSE_AND_NOTIFY_CLINICIAN');
      assert.equal(severe.locationDetected, 'KNEE');

      const mild = triageConversationalPain('Just feeling stiff in my shoulder');
      assert.equal(mild.severity, 'MILD');
      assert.equal(mild.suggestedAction, 'CONTINUE');
      assert.equal(mild.locationDetected, 'SHOULDER');
    });
  });

  describe('5. Soundwave Visualizer Driver', () => {
    test('Returns baseline bars when idle', () => {
      const frame = generateSoundwaveBars(16, 0, false);
      assert.equal(frame.bars.length, 16);
      assert.equal(frame.isActive, false);
      assert.equal(frame.bars[0], 0.15);
    });

    test('Returns oscillating active bars when speaking', () => {
      const frame = generateSoundwaveBars(16, 1.5, true);
      assert.equal(frame.isActive, true);
      assert.ok(frame.bars.every((b) => b >= 0.2 && b <= 1.0));
    });
  });
});
