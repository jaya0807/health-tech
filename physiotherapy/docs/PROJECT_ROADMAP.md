# 🚀 Development Roadmap & Phases
### AI Recovery Companion (PhysioAI) — Pure Development Lifecycle

> **Note**: This roadmap strictly focuses on engineering, AI modeling, biomechanical mathematics, UI development, and clinical validation. It intentionally excludes cloud/DevOps deployment.

---

## 🗺️ High-Level Phase Progression

```
+---------------------------------------------------------------------------------------------------+
|  PHASE 1: Core Kinematics & Vision Engine (Landmarks, 3D Vector Math, MQS Scoring)                |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 2: Sub-100ms Voice Coach & Conversational AI (TTS/STT, Multilingual Cues)                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 3: Live Workout Camera HUD & AR Trajectory Overlays (Canvas Skeleton, Angle Arc, Rep State)|
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 4: Adaptive Intelligence, Safety & Anomaly Detection (Fatigue FFT, Fall Detection, Objects)|
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 5: 3D Digital Twin & Gamification (Three.js Mesh, Heatmap Shaders, Timeline Scrubber)      |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 6: Onboarding, Clinician Portal & Medical PDF Reporting (Prescriptions, Triage, PDF Engine)|
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|  PHASE 7: Biomechanical Calibration, Latency Optimization & End-to-End Validation                |
+---------------------------------------------------------------------------------------------------+
```

---

## 📌 Phase 1: Biomechanical Core & Computer Vision Foundation

### 🎯 Objective
Build the mathematical and computer vision foundation for landmark tracking, 3D joint angle calculation, landmark smoothing, and Motion Quality Score (MQS) without any UI coupling.

### 🔨 Key Deliverables & Components
1. **Pose Landmarker Adapter** (`src/core/vision/poseDetector.ts`):
   - MediaPipe Pose / ONNX Web runtime wrapper.
   - Extracts 33 3D landmarks `(x, y, z, visibility)` at 30–60 FPS.
2. **Landmark Smoothing Filter** (`src/core/vision/landmarkSmoothing.ts`):
   - 1-Euro / Exponential Moving Average filter to eliminate camera sensor jitter without adding lag.
3. **Pure 3D Vector Kinematics** (`src/core/kinematics/angleCalculator.ts`):
   - 3D dot-product angle formula: $\theta = \arccos\left(\frac{\vec{u} \cdot \vec{v}}{\|\vec{u}\| \|\vec{v}\|}\right)$.
   - Calculations for Knee Flexion, Shoulder Abduction/Flexion, Elbow Flexion, Hip Flexion, Trunk Tilt.
4. **Velocity, Jerk & Bilateral Symmetry** (`src/core/kinematics/velocityJerkEstimator.ts`, `bilateralSymmetry.ts`):
   - First & second derivatives ($\omega = \frac{\Delta \theta}{\Delta t}$, $\alpha = \frac{\Delta \omega}{\Delta t}$).
   - Normalized Jerk Cost calculation.
5. **Motion Quality Score (MQS) Engine** (`src/core/kinematics/motionQualityScore.ts`):
   - 4-parameter weighted formula (Accuracy 35%, Balance 25%, Smoothness 20%, Symmetry 20%).

### 🧪 Verification Gate
- [x] Unit test suite verifying angle accuracy against known geometric ground-truth vectors ($\pm 0.5^\circ$ tolerance).
- [x] Zero DOM/UI dependencies; runs purely in headless Node / Jest test runner.

---

## 📌 Phase 2: Sub-100ms Voice Coach & Conversational AI

### 🎯 Objective
Implement the audio feedback system that speaks natural, human-like micro-corrections in real time and handles context-aware voice conversations.

### 🔨 Key Deliverables & Components
1. **Low-Latency Neural Speech Synthesizer** (`src/core/voice/speechSynthesizer.ts`):
   - Streaming Web Speech API / Edge TTS engine with audio buffer caching for sub-100ms playback.
2. **Deterministic Kinematic Rule Engine** (`src/features/liveWorkout/hooks/useVoiceCoachLogic.ts`):
   - Evaluates joint angle deltas and triggers immediate guidance:
     - Under-flexion: *"Bend your knee 15° more."*
     - Over-speed: *"Slow down your movement."*
     - Postural drop: *"Keep your chest upright."*
     - Success: *"Great form! 3 more reps."*
3. **Audio Cues Multi-Lingual Matrix** (`src/core/voice/audioFeedbackPresets.ts`):
   - Localized prompt tables in English, Hindi, Odia, Tamil, Telugu, Spanish.
4. **Conversational Pain & Status Dialogue Engine** (`src/core/voice/speechRecognizer.ts`):
   - STT listener allowing natural responses (*"My knee hurts today"* $\to$ AI clarifies pain location & adjusts plan).
5. **Voice Waveform Driver** (`src/core/voice/soundwaveVisualizer.ts`):
   - Real-time audio frequency analyzer driving HUD glowing waveforms.

### 🧪 Verification Gate
- [x] Audio trigger latency $< 120\text{ms}$ from kinematic threshold breach.
- [x] Speech de-duplication guard prevents overlapping audio cues.

---

## 📌 Phase 3: Live Workout Camera HUD & AR Guidance

### 🎯 Objective
Construct the modular, high-performance camera workout screen with real-time skeleton overlay, dynamic angle arcs, rep counters, and AR ghost trajectory.

### 🔨 Key Deliverables & Components
1. **Camera Stream Manager** (`src/core/vision/cameraStreamManager.ts`):
   - Native `getUserMedia` / WebRTC stream handler with dynamic resolution scaling (720p/1080p).
2. **Skeleton Canvas Overlay** (`src/features/liveWorkout/components/SkeletonCanvasOverlay.tsx`):
   - High-FPS canvas overlay drawing glowing bone connections, color-coded by biomechanical quality.
3. **Dynamic Joint Arc Gauge** (`src/shared/components/AngleGaugeArc.tsx`):
   - Floating SVG circular arc showing real-time angle vs. target zone (Cyan $\to$ Green $\to$ Red).
4. **Biomechanical Repetition State Machine** (`src/features/liveWorkout/components/RepetitionCounter.tsx`):
   - State transitions: `IDLE` $\to$ `CONCENTRIC` $\to$ `INFLECTION (Target Check)` $\to$ `ECCENTRIC` $\to$ `COUNTED`.
   - **Only counts repetitions meeting full ROM and minimum MQS score ($> 70$)**.
5. **AR Trajectory Ghost Avatar** (`src/features/liveWorkout/components/ArTrajectoryGuide.tsx`):
   - Semi-transparent holographic limb demonstrating the smooth movement path.
6. **Live Workout Orchestrator Hook** (`src/features/liveWorkout/hooks/useWorkoutSession.ts`):
   - Coordinates camera, kinematics, audio coach, timer, and state machine under 110 lines.

### 🧪 Verification Gate
- [x] Continuous 30+ FPS rendering on mid-range devices during active camera + canvas render.
- [x] Repetition counter accurately rejects incomplete or excessively fast reps.

---

## 📌 Phase 4: Adaptive Intelligence, Safety & Anomaly Detection

### 🎯 Objective
Equip the coach with safety guardians: tremor-based fatigue detection, posture compensation detection, emergency fall detection, and home object recognition.

### 🔨 Key Deliverables & Components
1. **Muscle Tremor & Fatigue Estimator** (`src/core/safety/fatigueEstimator.ts`):
   - Rolling 64-frame FFT detecting 3–7 Hz micro-tremors in limb coordinates.
   - Deceleration tracking: flags prolonged eccentric phase decay.
   - Auto-triggers rest advice: *"You look tired. Let's take a 2-minute rest."*
2. **Postural Compensation Detector**:
   - Detects abnormal trunk lateral tilt ($\Delta > 8^\circ$) or contralateral weight shift.
3. **Emergency Fall Detector** (`src/core/safety/fallDetector.ts`, `emergencyDispatcher.ts`):
   - Sudden vertical descent velocity ($> 2.8\text{ m/s}$) followed by sustained horizontal floor alignment.
   - Initiates 10-second audible siren countdown with "I AM OK" override modal.
4. **Home Object Classifier** (`src/core/vision/objectDetector.ts`):
   - Lightweight MobileNet/YOLO-nano edge detector recognizing chairs, walls, stairs, and towels.
   - Contextual prompt injection: *"Place a chair on your left for stability."*
5. **Adaptive Plan Synthesizer** (`src/features/planGenerator/hooks/usePlanSynthesis.ts`):
   - Dynamically scales next day's set/rep/target angle based on logged pain VAS scores and fatigue events.

### 🧪 Verification Gate
- [x] Fall detection algorithm triggers within 1.5s of simulated sudden drop.
- [x] Micro-pain rating $\ge 6$ immediately scales down current workout intensity by 30%.

---

## 📌 Phase 5: 3D Digital Twin & Gamification System

### 🎯 Objective
Build the 3D anatomical recovery visualizer and gamified recovery progression engine to maximize patient engagement.

### 🔨 Key Deliverables & Components
1. **Three.js Anatomical Body Loader** (`src/core/digitalTwin/meshLoader.ts`):
   - Parametric 3D human body model with 18 anatomical joint pivots.
2. **Joint Rig Mapper** (`src/core/digitalTwin/jointRigMapper.ts`):
   - Maps patient telemetry angles (e.g. knee flexion $95^\circ$) to 3D skeleton bones.
3. **Recovery Heatmap Shader** (`src/core/digitalTwin/recoveryShaderMaterial.ts`):
   - GLSL custom shader: Acute/Inflamed (Red), Healing (Amber), Restored (Emerald Green).
4. **Timeline Interpolator** (`src/core/digitalTwin/twinTimelineInterpolator.ts`, `TwinTimelineSlider.tsx`):
   - Interactive slider allowing patient to scrub from *Week 1 ($45^\circ$)* to *Current Week ($95^\circ$)*.
5. **Gamification & Streak Badges** (`src/features/analytics/components/StreakBadgeGrid.tsx`):
   - Daily streak tracker, Star rewards, Recovery Milestone Badges (Bronze, Silver, Gold).

### 🧪 Verification Gate
- [x] 60 FPS smooth 3D mesh interaction (orbit, pan, zoom) with WebGL fallback.
- [x] Seamless shader color interpolation as the timeline slider is dragged.

---

## 📌 Phase 6: Clinical Portals, Caregiver Bridge & PDF Reporting

### 🎯 Objective
Complete the patient onboarding flow, the clinician telemetry dashboard, the caregiver communication bridge, and the medical PDF report generator.

### 🔨 Key Deliverables & Components
1. **Smart Clinical Onboarding Flow** (`src/features/onboarding/`):
   - Vitals & demographics input, prior injury picker, 0–10 baseline pain slider, prescription upload.
2. **Interactive Body Area & Condition Selector** (`src/features/recoveryArea/`):
   - Anatomical silhouette selection (Neck, Shoulder, Knee, Hip, Spine) + specific condition chips (ACL, Frozen Shoulder, etc.).
3. **Clinician & Doctor Dashboard** (`src/features/doctorPortal/`):
   - Triage risk list (Red: Pain spike / Missed sessions, Green: On schedule).
   - Telemetry session playback inspector with angle vs. time charts.
   - Prescription editor to remotely update target angles and exercise volume.
4. **Caregiver & Family Bridge** (`src/features/familyPortal/`):
   - Asynchronous daily digest card, safety status badge, and "Send Cheer" voice/sticker button.
5. **Medical-Grade Clinical PDF Report Generator** (`src/features/analytics/components/ExportReportButton.tsx`):
   - Generates multi-page clinical report with ROM progression graphs, pain trends, and doctor sign-off block.

### 🧪 Verification Gate
- [x] Prescription updates sync immediately to the patient's plan state.
- [x] PDF report exports cleanly with formatted vector charts and metrics.

---

## 📌 Phase 7: Biomechanical Calibration, Profiling & Polish

### 🎯 Objective
Verify kinematic precision against clinical physical therapy standards, profile runtime performance, and ensure strict compliance with the zero-bloat code architecture.

### 🔨 Key Deliverables & Components
1. **Goniometer Kinematic Benchmarking**:
   - Test video benchmarks against physical goniometer angle measurements ($\le \pm 2^\circ$ deviation).
2. **Edge Latency & Memory Profiling**:
   - Ensure constant memory footprint (no memory leaks across 45-minute continuous exercise sessions).
   - Verify camera frame buffer garbage collection.
3. **Robustness Under Imperfect Conditions**:
   - Validate tracking under low light, loose athletic wear, partial camera occlusion, and varying camera distances (1.5m – 3.5m).
4. **Code Modularity & Line Count Audit**:
   - Enforce `< 120 lines of code per file` across all `src/` modules.

---

## 📊 Summary of Phase Milestones & Deliverables

| Phase | Core Milestone | Primary Tech / Modules | Duration Focus |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Kinematics & Vision Core | MediaPipe / ONNX / 3D Vector Math / MQS | Pure Math & CV |
| **Phase 2** | Real-time Voice AI Coach | Neural TTS / STT / Rule Engine / Multi-language | Audio & Conversational |
| **Phase 3** | Live Workout Camera HUD | Canvas 2D/WebGL / SVG Gauges / Rep State Machine | Interactive HUD UI |
| **Phase 4** | Safety & Adaptive AI | 3-7Hz FFT Tremor / Fall Trigger / YOLO-nano Objects | Anomaly & Safety Logic |
| **Phase 5** | 3D Digital Twin & Gamification| Three.js / GLSL Shaders / Timeline Interpolation | 3D Graphics & UX |
| **Phase 6** | Clinician Portal & PDF Reports| React Components / Recharts / PDF Engine | Clinical Workflows |
| **Phase 7** | Biomechanical Validation & Audit| Goniometer Testing / Performance Profiling | Quality Assurance |
