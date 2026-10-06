# 📁 Modular Architecture & Zero-Code-Bloat Directory Blueprint
### AI Recovery Companion (PhysioAI)

---

## 1. Zero-Code-Bloat Architectural Principles

To guarantee that no file becomes an unmaintainable monolith, the codebase follows the **Feature-Sliced Clean Architecture (FSD)** combined with strict modularity constraints:

```
+---------------------------------------------------------------------------------------------------+
|                                  THE 5 MODULARITY RULES                                           |
+---------------------------------------------------------------------------------------------------+
| 1. Max 120 Lines Per File   : Any file exceeding 120 lines must be decomposed.                   |
| 2. Strict Single Purpose    : UI View, Kinematic Math, Audio Engine, and API State never mix.     |
| 3. Pure Mathematical Cores  : Geometric angle & MQS formulas have zero UI/DOM dependencies.      |
| 4. Custom Hook Abstraction  : UI components only render JSX; all state & logic lives in hooks.   |
| 5. Explicit Micro-Contracts : Every feature exports explicit types and a minimal public API.      |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Complete Zero-Bloat Directory Structure

```
ai-recovery-companion/
├── README.md                                # Root documentation & vision
├── docs/                                    # Architectural & clinical specifications
│   ├── SYSTEM_ARCHITECTURE.md               # Infrastructure & security
│   ├── AI_ML_PIPELINE_SPEC.md               # Kinematics & AI models
│   ├── UI_UX_SPECIFICATION.md               # Design tokens & screen layouts
│   ├── FOLDER_STRUCTURE_AND_CODE_MODULARITY.md # This blueprint
│   └── DATA_MODELS_AND_API_CONTRACTS.md     # Interfaces, Zod schemas & APIs
│
├── src/
│   ├── main.tsx                             # App bootstrap & providers (~45 lines)
│   ├── App.tsx                              # App routing & root layout (~60 lines)
│   │
│   ├── core/                                # Framework-agnostic pure logic engines
│   │   ├── kinematics/                      # Pure Biomechanical Math Engine
│   │   │   ├── angleCalculator.ts           # 3D Vector angle formula (~40 lines)
│   │   │   ├── velocityJerkEstimator.ts     # Angular velocity & jerk math (~55 lines)
│   │   │   ├── motionQualityScore.ts        # MQS composite weighting formula (~70 lines)
│   │   │   ├── bilateralSymmetry.ts         # Contralateral symmetry calculator (~45 lines)
│   │   │   └── types.ts                     # Landmark & Kinematic interfaces (~35 lines)
│   │   │
│   │   ├── vision/                          # Edge Computer Vision Pipeline
│   │   │   ├── cameraStreamManager.ts       # Camera initialization & frame buffer (~75 lines)
│   │   │   ├── poseDetector.ts              # MediaPipe/ONNX runtime wrapper (~90 lines)
│   │   │   ├── objectDetector.ts            # Home object classifier (chair/wall) (~85 lines)
│   │   │   └── landmarkSmoothing.ts         # Kalman / Exponential moving filter (~60 lines)
│   │   │
│   │   ├── voice/                           # Conversational Voice & Audio Engine
│   │   │   ├── speechSynthesizer.ts         # Low-latency Neural TTS stream (~80 lines)
│   │   │   ├── speechRecognizer.ts          # STT voice command listener (~70 lines)
│   │   │   ├── audioFeedbackPresets.ts      # Multi-lingual audio cues matrix (~95 lines)
│   │   │   └── soundwaveVisualizer.ts       # Audio amplitude FFT driver (~50 lines)
│   │   │
│   │   ├── safety/                          # Safety & Anomaly Guards
│   │   │   ├── fallDetector.ts              # Velocity drop & floor plane trigger (~75 lines)
│   │   │   ├── fatigueEstimator.ts          # Tremor FFT & velocity decay logic (~80 lines)
│   │   │   └── emergencyDispatcher.ts       # Caregiver alert & siren protocol (~65 lines)
│   │   │
│   │   └── digitalTwin/                     # 3D Anatomical Mesh Model
│   │       ├── meshLoader.ts                # Three.js 3D body loader (~65 lines)
│   │       ├── jointRigMapper.ts            # Maps telemetry angles to 3D bones (~85 lines)
│   │       ├── recoveryShaderMaterial.ts    # Red-Yellow-Green recovery heatmap (~70 lines)
│   │       └── twinTimelineInterpolator.ts  # Week 1 -> Week N animation math (~60 lines)
│   │
│   ├── shared/                              # Reusable Atomic UI Primitives & Utilities
│   │   ├── components/                      # Atomic Glassmorphic UI Components (<60 lines each)
│   │   │   ├── GlassCard.tsx                # Backdrop-filtered container
│   │   │   ├── PrimaryButton.tsx            # Glowing micro-interactive button
│   │   │   ├── AngleGaugeArc.tsx            # Floating SVG angle indicator
│   │   │   ├── CircularMqsRing.tsx          # Motion Quality circular meter
│   │   │   ├── PainRatingSlider.tsx         # 0-10 VAS slider with animated emoji
│   │   │   ├── VoiceWaveform.tsx            # Glowing live audio wave
│   │   │   ├── Badge.tsx                    # Clinical status chip (Active/Rest)
│   │   │   └── ModalContainer.tsx           # Accessible glass dialog
│   │   │
│   │   ├── hooks/                           # Shared utility hooks (<50 lines each)
│   │   │   ├── useWindowDimensions.ts       # Responsive viewport listener
│   │   │   ├── useAudioPlayer.ts            # Sound effect buffer trigger
│   │   │   └── useIntervalTimer.ts          # Accurate rehab chronometer
│   │   │
│   │   ├── styles/                          # CSS design system & tokens
│   │   │   ├── designTokens.css             # HSL variables & typography (~75 lines)
│   │   │   ├── glassmorphism.css            # Glass utility classes (~50 lines)
│   │   │   └── animations.css               # Spring & pulse keyframes (~60 lines)
│   │   │
│   │   └── utils/
│   │       ├── formatters.ts                # Date, degree & percentage formats (~45 lines)
│   │       └── validation.ts                # Input sanitizers (~40 lines)
│   │
│   └── features/                            # Feature-Sliced Application Modules
│       │
│       ├── onboarding/                      # 1. Patient Clinical Onboarding
│       │   ├── components/
│       │   │   ├── OnboardingStepBar.tsx    # Step indicator (1 of 4) (~40 lines)
│       │   │   ├── VitalsForm.tsx           # Demographics inputs (~85 lines)
│       │   │   ├── MedicalHistoryForm.tsx   # Prior surgeries/conditions (~75 lines)
│       │   │   └── PrescriptionUpload.tsx   # OCR drag-and-drop box (~80 lines)
│       │   ├── hooks/useOnboardingState.ts  # Form validation & multi-step state (~90 lines)
│       │   └── index.ts                     # Module export (~20 lines)
│       │
│       ├── recoveryArea/                    # 2. Body Area & Condition Picker
│       │   ├── components/
│       │   │   ├── BodyZoneMap.tsx          # Interactive 3D/SVG body silhouette (~85 lines)
│       │   │   ├── ConditionSelector.tsx    # ACL/Meniscus/Frozen shoulder chips (~70 lines)
│       │   │   └── SelectedZoneSummary.tsx  # Selected injury overview card (~50 lines)
│       │   ├── hooks/useRecoveryArea.ts     # Zone selection store connector (~60 lines)
│       │   └── index.ts                     # Module export (~15 lines)
│       │
│       ├── planGenerator/                   # 3. AI Personalized Plan Hub
│       │   ├── components/
│       │   │   ├── PlanMilestoneCard.tsx    # Week 1-3 progress cards (~75 lines)
│       │   │   ├── RecoveryForecastWidget.ts# 7.5 weeks predicted recovery gauge (~65 lines)
│       │   │   └── ExerciseListPreview.tsx  # Exercise thumbnails & rep targets (~70 lines)
│       │   ├── hooks/usePlanSynthesis.ts    # AI plan generation hook (~80 lines)
│       │   └── index.ts                     # Module export (~15 lines)
│       │
│       ├── liveWorkout/                     # 4. Live Exercise Camera HUD (AI Coach)
│       │   ├── components/
│       │   │   ├── CameraViewport.tsx       # Video element & canvas overlay (~70 lines)
│       │   │   ├── SkeletonCanvasOverlay.tsx# Renders 3D glowing joint lines (~95 lines)
│       │   │   ├── RepetitionCounter.tsx    # Live reps + MQS percentage ring (~60 lines)
│       │   │   ├── CoachFeedbackBanner.tsx  # Live audio message subtitle bar (~55 lines)
│       │   │   ├── PainQuickCheckModal.tsx  # Micro pain check-in dialog (~75 lines)
│       │   │   └── ArTrajectoryGuide.tsx    # Ghost limb visual guide (~80 lines)
│       │   ├── hooks/
│       │   │   ├── useWorkoutSession.ts     # Main workout orchestrator hook (~110 lines)
│       │   │   └── useVoiceCoachLogic.ts    # Evaluates kinematics & speaks (~85 lines)
│       │   └── index.ts                     # Module export (~25 lines)
│       │
│       ├── digitalTwin/                     # 5. 3D Digital Twin Viewer
│       │   ├── components/
│       │   │   ├── TwinCanvas3D.tsx         # WebGL / Three.js viewport (~85 lines)
│       │   │   ├── TwinTimelineSlider.tsx   # Week 1 vs Current slider (~65 lines)
│       │   │   └── MobilityDeltaStats.tsx   # Flexion gain & swelling stats (~60 lines)
│       │   ├── hooks/useDigitalTwinState.ts # Model loader & animation controller (~90 lines)
│       │   └── index.ts                     # Module export (~20 lines)
│       │
│       ├── analytics/                       # 6. Recovery Progress & Streaks
│       │   ├── components/
│       │   │   ├── RomProgressionChart.tsx  # Flexion angle over weeks chart (~80 lines)
│       │   │   ├── PainCurveChart.tsx       # Pain VAS trendline (~75 lines)
│       │   │   ├── StreakBadgeGrid.tsx      # Gamification stars & badges (~65 lines)
│       │   │   └── ExportReportButton.tsx   # Triggers clinical PDF download (~50 lines)
│       │   ├── hooks/useAnalyticsData.ts    # Telemetry aggregation hook (~75 lines)
│       │   └── index.ts                     # Module export (~20 lines)
│       │
│       ├── doctorPortal/                    # 7. Clinician & Therapist Dashboard
│       │   ├── components/
│       │   │   ├── PatientRosterTable.tsx   # Triage-sorted patient list (~90 lines)
│       │   │   ├── TelemetryPlayback.tsx    # Playback session with angles (~95 lines)
│       │   │   ├── PrescriptionEditor.tsx   # Adjust reps, target angles (~85 lines)
│       │   │   └── AiClinicalSummaryCard.tsx# LLM patient anomaly summary (~70 lines)
│       │   ├── hooks/useDoctorPortal.ts     # Clinician patient management hook (~90 lines)
│       │   └── index.ts                     # Module export (~25 lines)
│       │
│       └── familyPortal/                    # 8. Caregiver & Family Bridge
│           ├── components/
│           │   ├── DailyDigestCard.tsx      # Daily status & pain summary (~70 lines)
│           │   ├── SendCheerBox.tsx         # Voice/sticker cheer sender (~65 lines)
│           │   └── EmergencyStatusBadge.tsx # Safety status indicator (~45 lines)
│           ├── hooks/useFamilyBridge.ts     # Caregiver data stream hook (~65 lines)
│           └── index.ts                     # Module export (~20 lines)
```

---

## 3. How This Deconstruction Prevents Monoliths & Code Bloat

### Case Study: Deconstructing the "Live Workout HUD"
In inferior architectures, a camera screen with AI vision, audio, rep counting, and canvas overlays turns into a single unmaintainable 2,000-line file.

In **PhysioAI**, it is decomposed into **7 single-purpose micro-files**:
1. `angleCalculator.ts` (40 lines): Pure vector arithmetic.
2. `motionQualityScore.ts` (70 lines): Pure MQS formula.
3. `cameraStreamManager.ts` (75 lines): WebRTC / getUserMedia driver.
4. `useVoiceCoachLogic.ts` (85 lines): Kinematic rules $\to$ TTS trigger.
5. `SkeletonCanvasOverlay.tsx` (95 lines): Pure Canvas rendering.
6. `RepetitionCounter.tsx` (60 lines): Visual rep pill.
7. `useWorkoutSession.ts` (110 lines): Connects state machines cleanly.

**Result**: Zero file exceeds 120 lines. 100% testable, extensible, and free of code bloat.
