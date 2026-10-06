# Product Requirements Document (PRD): PhysioCare

## 1. Product Vision
To democratize access to high-quality physiotherapy by transforming everyday webcams and smartphones into intelligent, multilingual recovery coaches that provide clinical-grade feedback at zero hardware cost.

## 2. Target Audience
- **Patients:** Individuals recovering from orthopedic surgeries (e.g., ACL reconstruction, joint replacements) or musculoskeletal injuries, especially in remote or rural areas.
- **Clinicians:** Physiotherapists and orthopedic surgeons managing large caseloads who need objective home-exercise data to adjust treatment plans.
- **Healthcare Providers:** Hospitals and clinics looking to increase patient capacity and claim remote therapeutic monitoring (RTM) reimbursements.

## 3. Core Features & Requirements

### P0 (Must Have)
- **Real-Time Kinematic Tracking:** Utilize standard 2D webcams to extract 3D skeletal landmarks.
- **Interactive Exercise HUD:** Display real-time angle gauges, progress rings, and repetition counters.
- **Multilingual Voice Coach:** Provide instant corrective audio feedback in local languages (English, Hindi, Odia, etc.).
- **Smart Repetition State Machine:** Only count valid reps that meet the target angle and form thresholds.
- **Doctor Portal:** Dashboard displaying a triage list of patients, compliance rates, and form scores.

### P1 (Should Have)
- **Joint Stress Safety Checks:** Estimate patellar shear forces and valgus deviation to prevent injury.
- **Pain Biofeedback:** Allow users to log pain levels (VAS 0-10) during exercises, automatically halting sessions if pain is too high.
- **Clinical SOAP Note Generator:** Automatically draft structured clinical notes for clinician review.

### P2 (Nice to Have)
- **Predictive Recovery Forecast:** Estimate the time required to reach full range of motion milestones.
- **Simulink Integration:** Export kinematic data for advanced biomechanical validation in MATLAB/Simulink.

## 4. Technical Constraints
- **Client-Side Processing:** All video processing must occur in the browser to ensure zero latency and strict patient privacy (no video streaming to servers).
- **Hardware Agnosticism:** Must run smoothly (30+ FPS) on mid-range smartphones and laptops without GPUs.

## 5. Success Metrics
- **Clinical:** 90% accuracy in joint angle measurement compared to physical goniometers.
- **Engagement:** 80% patient retention and exercise compliance over a 4-week protocol.
- **Performance:** Sub-10ms processing latency per video frame on standard mobile browsers.
