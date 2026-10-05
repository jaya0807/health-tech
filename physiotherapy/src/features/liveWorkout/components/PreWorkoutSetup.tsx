import React, { RefObject } from 'react';
import { CameraViewport } from './CameraViewport.js';
import { AlertTriangle, ArrowRight } from 'lucide-react';

interface PreWorkoutSetupProps {
  exerciseName: string;
  videoRef: RefObject<HTMLVideoElement>;
  useWebcam: boolean;
  onStart: () => void;
}

export const getInstructions = (exercise: string) => {
  if (exercise.includes('Wall Crawl')) return [
    "Stand facing a wall, about arm's length away.",
    "Place your fingers gently on the wall.",
    "Slowly 'walk' your fingers up the wall as high as you comfortably can.",
    "Hold at the top, then slowly walk them back down."
  ];
  if (exercise.includes('Squat')) return [
    "Stand with feet shoulder-width apart.",
    "Lower your hips back and down as if sitting in a chair.",
    "Keep your chest up and back straight.",
    "Push through your heels to return to standing."
  ];
  if (exercise.includes('Pendulum')) return [
    "Lean forward, supporting your weight with your good arm on a table.",
    "Let your injured arm hang down freely.",
    "Gently swing the arm in small circles or forward and back.",
    "Let gravity do the work, keep the shoulder relaxed."
  ];
  return [
    `Get into the starting position for ${exercise}.`,
    "Follow the on-screen form guide and AI instructions.",
    "Perform the movement smoothly and steadily.",
    "Return to the starting position and repeat."
  ];
};

export const PreWorkoutSetup: React.FC<PreWorkoutSetupProps> = ({ exerciseName, videoRef, useWebcam, onStart }) => {
  const instructions = getInstructions(exerciseName);

  return (
    <div className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      width: '100%', 
      maxWidth: '720px', 
      padding: '24px',
      borderRadius: '16px',
      gap: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontSize: '20px', color: '#0f172a', margin: '0 0 4px 0', fontWeight: 600 }}>Setup: {exerciseName}</h2>
          <p style={{ color: '#475569', margin: 0, fontSize: '13px' }}>Please follow the instructions and align your camera before starting.</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '24px', alignItems: 'stretch' }}>
        {/* Left: Instructions */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {instructions.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.15)', 
                  color: '#10b981', 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '11px',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {idx + 1}
                </div>
                <p style={{ color: '#334155', margin: 0, fontSize: '14px', lineHeight: '1.4' }}>{step}</p>
              </div>
            ))}
          </div>

          <div style={{ padding: '12px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)', marginTop: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', marginBottom: '4px', fontWeight: 600, fontSize: '13px' }}>
              <AlertTriangle size={14} /> Safety First
            </div>
            <p style={{ color: '#475569', margin: 0, fontSize: '12px', lineHeight: '1.4' }}>
              Move within a pain-free range. Stop immediately if you feel sharp pain.
            </p>
          </div>
        </div>

        {/* Right: Camera Alignment */}
        <div style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: '#0f172a', margin: 0, fontSize: '13px', fontWeight: 600 }}>Camera Alignment</h3>
            {useWebcam && <span style={{ color: '#10b981', fontSize: '10px', fontWeight: 700, background: 'rgba(16,185,129,0.15)', padding: '2px 6px', borderRadius: '4px' }}>LIVE</span>}
          </div>
          
          <div style={{ height: '210px', background: '#fff', borderRadius: '8px', overflow: 'hidden', position: 'relative', border: '1px solid rgba(0,0,0,0.1)' }}>
            {useWebcam ? (
              <>
                <CameraViewport isMirrored={true} videoRef={videoRef} showVideo={useWebcam} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '60%', height: '80%', border: '2px dashed rgba(16, 185, 129, 0.4)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ background: 'rgba(255,255,255,0.8)', padding: '4px 8px', borderRadius: '12px', color: '#10b981', fontSize: '11px', fontWeight: 600, backdropFilter: 'blur(2px)' }}>
                      Align here
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={24} color="#94a3b8" />
                </div>
                <p style={{ color: '#64748b', margin: 0, fontSize: '12px' }}>Webcam is off</p>
              </div>
            )}
          </div>
          
          {useWebcam && (
            <p style={{ color: '#475569', margin: 0, fontSize: '11px', textAlign: 'center' }}>
              Step back until your upper body is visible.
            </p>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button 
          onClick={onStart}
          style={{ 
            padding: '10px 24px', 
            background: '#10b981', 
            border: 'none', 
            borderRadius: '8px', 
            color: '#fff', 
            fontSize: '14px', 
            fontWeight: 700, 
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#059669'}
          onMouseOut={(e) => e.currentTarget.style.background = '#10b981'}
        >
          I'm Ready - Start <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
