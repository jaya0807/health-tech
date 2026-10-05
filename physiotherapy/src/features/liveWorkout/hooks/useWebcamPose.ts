import { useState, useEffect, useRef, RefObject } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@tensorflow/tfjs-converter';
import * as poseDetection from '@tensorflow-models/pose-detection';
import { Landmark3D } from '../../../core/kinematics/types.js';

export function useWebcamPose(isActive: boolean, videoRef: RefObject<HTMLVideoElement | null>) {
  const [landmarks, setLandmarks] = useState<Landmark3D[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Hold the stream and detector in refs so they persist across renders
  // and are accessible for cleanup even if isActive changes quickly.
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const rafIdRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (!isActive) {
      // Cleanly stop everything when tab becomes inactive
      isRunningRef.current = false;
      cancelAnimationFrame(rafIdRef.current);
      if (detectorRef.current) {
        detectorRef.current.dispose();
        detectorRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setLandmarks([]);
      return;
    }

    let isCancelled = false;

    const initialize = async () => {
      try {
        await tf.ready();
        if (isCancelled) return;

        // Request camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480, facingMode: 'user' }
        });
        if (isCancelled) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;

        // Load MoveNet Thunder (Highly accurate, avoids BlazePose WebGL crashes)
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER }
        );
        if (isCancelled) {
          detector.dispose();
          return;
        }
        detectorRef.current = detector;

        // Attach stream to whatever video element is currently in the DOM
        const attachAndPlay = async () => {
          const video = videoRef.current;
          if (!video || !streamRef.current) return;
          if (video.srcObject !== streamRef.current) {
            video.srcObject = streamRef.current;
          }
          if (video.paused) {
            await video.play().catch(e => console.warn('video.play():', e));
          }
        };

        await attachAndPlay();
        if (isCancelled) return;

        let smoothedLandmarks: Landmark3D[] = [];
        const alpha = 0.4;
        isRunningRef.current = true;

        const detectPose = async () => {
          if (isCancelled || !isRunningRef.current) return;

          const video = videoRef.current;
          if (!video || !detectorRef.current) {
            rafIdRef.current = requestAnimationFrame(detectPose);
            return;
          }

          // Re-attach stream if the video element changed (SETUP → ACTIVE re-mount)
          if (video.srcObject !== streamRef.current) {
            await attachAndPlay();
          }

          if (video.readyState >= 2) {
            try {
              const poses = await detectorRef.current.estimatePoses(video);
              if (poses.length > 0) {
                const kp = poses[0].keypoints;

                const mapKp = (index: number): Landmark3D => {
                  const k = kp[index];
                  return k
                    ? { x: k.x, y: k.y, z: 0, visibility: k.score ?? 0 }
                    : { x: 0, y: 0, z: 0, visibility: 0 };
                };

                // Pass all 17 raw MoveNet keypoints directly — no remapping.
                // MoveNet topology (https://github.com/tensorflow/tfjs-models/tree/master/pose-detection):
                // 0=Nose, 1=Left Eye, 2=Right Eye, 3=Left Ear, 4=Right Ear,
                // 5=Left Shoulder, 6=Right Shoulder, 7=Left Elbow, 8=Right Elbow,
                // 9=Left Wrist, 10=Right Wrist, 11=Left Hip, 12=Right Hip,
                // 13=Left Knee, 14=Right Knee, 15=Left Ankle, 16=Right Ankle
                const currentMapped: Landmark3D[] = Array.from({ length: 17 }, (_, i) => mapKp(i));

                console.log('[Pose] Landmarks:', currentMapped.map((lm, i) =>
                  `${i}:vis=${lm.visibility?.toFixed(2)}`).join(' '));

                if (smoothedLandmarks.length === 0) {
                  smoothedLandmarks = currentMapped;
                } else {
                  smoothedLandmarks = currentMapped.map((lm, i) => {
                    const prev = smoothedLandmarks[i];
                    if (
                      lm.visibility !== undefined &&
                      lm.visibility < 0.25 &&
                      prev.visibility !== undefined &&
                      prev.visibility > 0.1
                    ) {
                      return { ...prev, visibility: prev.visibility * 0.95 };
                    }
                    return {
                      x: prev.x + alpha * (lm.x - prev.x),
                      y: prev.y + alpha * (lm.y - prev.y),
                      z: lm.z,
                      visibility: lm.visibility,
                    };
                  });
                }

                setLandmarks([...smoothedLandmarks]);
              }
            } catch (err) {
              console.warn('Pose estimation skipped a frame', err);
            }
          }

          if (!isCancelled && isRunningRef.current) {
            rafIdRef.current = requestAnimationFrame(detectPose);
          }
        };

        detectPose();
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Webcam/pose init error:', err);
          setError(err.message || String(err));
        }
      }
    };

    initialize();

    return () => {
      isCancelled = true;
      isRunningRef.current = false;
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [isActive]);

  // Separate effect: whenever the video element in the DOM changes, re-attach the stream.
  // This handles the SETUP → ACTIVE re-mount where the <video> node is replaced.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamRef.current) return;
    if (video.srcObject !== streamRef.current) {
      video.srcObject = streamRef.current;
      video.play().catch(e => console.warn('re-attach play():', e));
    }
  });

  return { landmarks, error };
}
