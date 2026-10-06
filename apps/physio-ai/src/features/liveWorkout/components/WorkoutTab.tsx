import React, { useState, useRef, useEffect } from 'react';
import { Minus, Plus, AlertTriangle } from 'lucide-react';
import { CameraViewport } from './CameraViewport.js';
import { SkeletonCanvasOverlay } from './SkeletonCanvasOverlay.js';
import { RepetitionCounter } from './RepetitionCounter.js';
import { CoachFeedbackBanner } from './CoachFeedbackBanner.js';
import { AngleGaugeArc } from '../../../shared/components/AngleGaugeArc.js';
import { CircularMqsRing } from '../../../shared/components/CircularMqsRing.js';
import { PainRatingSlider } from '../../../shared/components/PainRatingSlider.js';
import { VoiceWaveform } from '../../../shared/components/VoiceWaveform.js';
import { useWebcamPose } from '../hooks/useWebcamPose.js';
import { useLiveKinematics } from '../hooks/useLiveKinematics.js';
import { useVoiceCoach } from '../hooks/useVoiceCoach.js';
import { PreWorkoutSetup, getInstructions } from './PreWorkoutSetup.js';
import { TargetMuscles } from './TargetMuscles.js';
import { SessionRoutine } from './SessionRoutine.js';
import { ManualWorkoutLog } from './ManualWorkoutLog.js';
import { LiveFormStatus, RepQualityStats, LiveMovementGraph, TargetVsActual } from './LiveAnalysisComponents.js';
import { PatientProfile } from '../../onboarding/PatientOnboardingModal.js';
import { PrescriptionData } from '../../portal/components/PrescriptionEditor.js';
import { exercisesByCondition, getExerciseGifUrl } from '../../../shared/utils/exerciseConfigs.js';
import { BiomechanicalRepStateMachine } from '../hooks/useWorkoutStateMachine.js';

interface WorkoutTabProps {
  patient: PatientProfile;
  rx: PrescriptionData;
  onPainChange: (v: number) => void;
  isActiveTab: boolean;
}

export const WorkoutTab: React.FC<WorkoutTabProps> = ({ patient, rx, onPainChange, isActiveTab }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [zoom, setZoom] = useState(1);
  const [selectedExercise, setSelectedExercise] = useState(patient.selectedExercise || '');
  const [workoutState, setWorkoutState] = useState<'SETUP' | 'ACTIVE' | 'PAUSED'>('SETUP');
  const [reps, setReps] = useState(0);
  const [maxAngleReached, setMaxAngleReached] = useState(0);

  // Biomechanical rep state machine — persists across renders via ref
  const stateMachineRef = useRef<BiomechanicalRepStateMachine | null>(null);

  const activeExerciseList = patient
    ? (exercisesByCondition[patient.condition as keyof typeof exercisesByCondition] || exercisesByCondition['ACL Reconstruction'])
    : exercisesByCondition['ACL Reconstruction'];
  const currentExercise = activeExerciseList.includes(selectedExercise) ? selectedExercise : activeExerciseList[0];

  // Re-instantiate the state machine whenever the exercise or target angle changes
  useEffect(() => {
    stateMachineRef.current = new BiomechanicalRepStateMachine({
      targetAngle: rx.targetAngleDeg,
    });
    setReps(0);
  }, [currentExercise, rx.targetAngleDeg]);

  // Also reset when transitioning back to SETUP
  useEffect(() => {
    if (workoutState === 'SETUP') {
      stateMachineRef.current?.reset();
      setReps(0);
    }
  }, [workoutState]);

  const { landmarks, error: webcamError } = useWebcamPose(isActiveTab, videoRef);
  const { currentAngle } = useLiveKinematics(landmarks, patient?.recoveryArea || 'Knee', currentExercise);

  const isWorkoutActive = isActiveTab && workoutState === 'ACTIVE';
  const currentMqs = Math.max(0, 100 - Math.floor(Math.abs(currentAngle - rx.targetAngleDeg) * 0.8));
  const stability = Math.max(0, currentMqs - 4);
  const exerciseGifUrl = getExerciseGifUrl(currentExercise);

  useEffect(() => {
    if (currentAngle > maxAngleReached) setMaxAngleReached(currentAngle);
  }, [currentAngle, maxAngleReached]);

  // Process each new angle reading through the rep state machine
  useEffect(() => {
    if (!isWorkoutActive || !stateMachineRef.current || currentAngle === 0) return;
    const result = stateMachineRef.current.update(currentAngle, currentMqs);
    if (result.repCount !== reps) {
      setReps(result.repCount);
    }
  }, [currentAngle, isWorkoutActive]);

  // Transition to next exercise when target reps are met
  useEffect(() => {
    if (reps > 0 && reps >= rx.targetReps) {
      const currentIndex = activeExerciseList.indexOf(currentExercise);
      if (currentIndex >= 0 && currentIndex < activeExerciseList.length - 1) {
        setSelectedExercise(activeExerciseList[currentIndex + 1]);
        setWorkoutState('SETUP');
        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("Set complete. Moving to the next exercise."));
        }
      } else if (currentIndex === activeExerciseList.length - 1) {
        setWorkoutState('SETUP');
        if ('speechSynthesis' in window) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance("Workout complete! Great job."));
        }
      }
    }
  }, [reps, rx.targetReps, activeExerciseList, currentExercise]);


  // Safety trigger: if pain >= 7, prompt to stop
  useEffect(() => {
    if (patient.painVas >= 7 && isWorkoutActive) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Pain level is too high. Please stop the exercise immediately.");
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [patient.painVas, isWorkoutActive]);

  const { coachMessage, phase, isSpeaking } = useVoiceCoach(currentAngle, rx.targetAngleDeg, isWorkoutActive);

  const handleZoomIn = () => setZoom(z => Math.min(2.5, parseFloat((z + 0.1).toFixed(1))));
  const handleZoomOut = () => setZoom(z => Math.max(0.5, parseFloat((z - 0.1).toFixed(1))));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
      {workoutState === 'SETUP' ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '16px 0', flex: 1, gap: '20px' }}>
          <div style={{ width: '100%', maxWidth: '640px', display: 'flex' }}>
            <select
              value={currentExercise}
              onChange={(e) => { setSelectedExercise(e.target.value); setWorkoutState('SETUP'); }}
              style={{ background: '#000000', color: '#ffffff', border: '1px solid #27272a', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', outline: 'none', width: 'fit-content' }}
            >
              {activeExerciseList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>
          <PreWorkoutSetup
            exerciseName={currentExercise}
            videoRef={videoRef}
            useWebcam={true}
            onStart={() => setWorkoutState('PAUSED')}
          />
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1400px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: 'fit-content' }}>

              {/* UPPER SECTION — Exercise selector + coach banner */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '640px', marginBottom: '24px' }}>
                <div style={{ display: 'flex' }}>
                  <select
                    value={currentExercise}
                    onChange={(e) => { setSelectedExercise(e.target.value); setWorkoutState('SETUP'); }}
                    style={{ background: 'rgba(255, 255, 255, 0.8)', color: '#0f172a', border: '1px solid rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', outline: 'none', width: 'fit-content' }}
                  >
                    {activeExerciseList.map(ex => <option key={ex} value={ex}>{ex}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '16px', width: '100%', alignItems: 'stretch' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <CoachFeedbackBanner currentMessage={coachMessage} isSpeaking={isSpeaking} />
                  </div>
                  <div className="glass-panel" style={{ padding: '4px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <VoiceWaveform isSpeaking={isSpeaking} />
                  </div>
                </div>
              </div>

              {/* LOWER SECTION */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap' }}>

                {/* LEFT COLUMN — Live Webcam Feed */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '640px', flexShrink: 0 }}>
                  {/* Main Viewport */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    {webcamError && (
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: '#ef4444', color: 'white', padding: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                        Camera Error: {webcamError}
                      </div>
                    )}
                    <CameraViewport isMirrored={true} videoRef={videoRef} showVideo={true} zoom={zoom}>
                      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <SkeletonCanvasOverlay landmarks={landmarks} width={640} height={480} isMirrored={true} />
                      </div>
                    </CameraViewport>

                    {/* Overlaid readouts */}
                    <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <AngleGaugeArc currentAngleDeg={currentAngle} targetAngleDeg={rx.targetAngleDeg} />
                      <CircularMqsRing score={currentMqs} size={84} />
                    </div>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 5 }}>
                      <LiveFormStatus currentAngle={currentAngle} targetAngle={rx.targetAngleDeg} stability={stability} coachMessage={coachMessage} />
                    </div>

                    {/* Zoom Controls */}
                    <div style={{
                      position: 'absolute', bottom: '16px', right: '16px',
                      display: 'flex', gap: '6px', alignItems: 'center',
                      background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)',
                      borderRadius: '10px', padding: '6px 10px', border: '1px solid rgba(0,0,0,0.1)'
                    }}>
                      <button
                        onClick={handleZoomOut}
                        style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        title="Zoom Out"
                      >
                        <Minus size={16} />
                      </button>
                      <span style={{ color: '#475569', fontSize: '12px', minWidth: '36px', textAlign: 'center' }}>
                        {Math.round(zoom * 100)}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        style={{ background: 'none', border: 'none', color: '#0f172a', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center' }}
                        title="Zoom In"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <RepQualityStats reps={reps} targetReps={rx.targetReps} formQuality={currentMqs} stability={stability} />
                  <LiveMovementGraph currentAngle={currentAngle} targetAngle={rx.targetAngleDeg} />

                  <div style={{ display: 'flex', gap: '24px', width: '100%' }}>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <SessionRoutine
                        routine={rx.exercises?.length ? rx.exercises : activeExerciseList.map(name => ({ name, sets: 3, reps: rx.targetReps })) as any}
                        currentExerciseIndex={Math.max(0, (rx.exercises?.length ? rx.exercises : activeExerciseList.map(name => ({ name }))).findIndex((e: any) => e.name === currentExercise))}
                      />
                      <TargetVsActual reps={reps} targetReps={rx.targetReps} maxAngle={maxAngleReached} targetAngle={rx.targetAngleDeg} formQuality={currentMqs} stability={stability} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <TargetMuscles exerciseName={currentExercise} />
                      <RepetitionCounter completedReps={reps} targetReps={rx.targetReps} phase={phase} currentMqs={currentMqs} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ flex: 1 }}><PainRatingSlider painScore={patient.painVas} onPainChange={onPainChange} /></div>
                    <button onClick={() => setWorkoutState(workoutState === 'PAUSED' ? 'ACTIVE' : 'PAUSED')} style={{ padding: '8px 16px', background: workoutState === 'PAUSED' ? (reps === 0 ? '#10b981' : '#f59e0b') : 'transparent', border: workoutState === 'PAUSED' ? (reps === 0 ? '1px solid #10b981' : '1px solid #f59e0b') : '1px solid rgba(0,0,0,0.2)', color: workoutState === 'PAUSED' ? '#fff' : '#475569', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>{workoutState === 'PAUSED' ? (reps === 0 ? 'Start Exercise' : 'Resume') : 'Pause'}</button>
                    <button onClick={() => setWorkoutState('SETUP')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #fca5a5', color: '#ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>End Session</button>
                  </div>
                </div>

                {/* RIGHT COLUMN — Coach Reference */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '320px', minWidth: '320px', flexShrink: 0 }}>
                  <div style={{ color: '#10b981', fontSize: '13px', fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }} />
                    Coach Reference
                  </div>
                  <div style={{ width: '320px', height: '240px', position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.05)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {exerciseGifUrl ? (
                      <img src={exerciseGifUrl} alt={currentExercise} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ color: '#475569', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
                        Reference video not available for <strong>{currentExercise}</strong>.<br/><br/>Please follow the text instructions below.
                      </div>
                    )}
                  </div>
                  <div className="glass-panel" style={{ padding: '16px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '320px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Instructions:</div>
                    {getInstructions(currentExercise).map((step: string, idx: number) => (
                      <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <div style={{ color: '#10b981', fontWeight: 700, fontSize: '12px', marginTop: '2px' }}>{idx + 1}.</div>
                        <div style={{ color: '#334155', fontSize: '13px', lineHeight: '1.4' }}>{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* MANUAL LOG SECTION */}
              <div style={{ marginTop: '24px', width: '100%', maxWidth: '984px' }}>
                <ManualWorkoutLog />
              </div>
            </div>
          </div>

          {/* Critical Pain Overlay */}
          {isWorkoutActive && patient.painVas >= 7 && (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(239, 68, 68, 0.1)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="glass-panel" style={{ padding: '40px', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.5)', background: 'rgba(255, 255, 255, 0.95)' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={40} color="#ef4444" />
                </div>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 12px 0' }}>Stop Exercise Immediately</h2>
                  <p style={{ color: '#334155', fontSize: '15px', lineHeight: '1.6', margin: 0 }}>Your reported pain level ({patient.painVas}/10) is too high. Please stop the exercise to prevent injury. Rest and contact your clinician if the pain persists.</p>
                </div>
                <button onClick={() => setWorkoutState('SETUP')} style={{ padding: '12px 24px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', width: '100%' }}>
                  End Session
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
