# 🎨 UI & UX Design System Specification
### AI Recovery Companion (PhysioAI)

---

## 1. Visual Design Philosophy & Tokens

The interface is engineered with a **Bio-Futuristic, Clinical-Grade Aesthetic**. It combines deep obsidian backgrounds with luminous biological accents, glassmorphic HUD overlays, and clean medical clarity.

### 1.1 Color Palette Tokens (Tailored HSL)

```css
:root {
  /* Surface & Base Tokens */
  --bg-obsidian: hsl(222, 47%, 7%);
  --bg-card-glass: hsla(220, 39%, 14%, 0.65);
  --bg-card-solid: hsl(220, 35%, 11%);
  --border-glass: hsla(217, 91%, 60%, 0.15);
  --border-active: hsl(190, 95%, 50%);

  /* Clinical Accent Colors */
  --accent-cyan: hsl(190, 95%, 50%);       /* Primary AI / Kinematics Glow */
  --bio-emerald: hsl(152, 76%, 48%);       /* Correct Rep / Optimal ROM */
  --warning-amber: hsl(38, 92%, 50%);      /* Fatigue / Mild Deviation */
  --acute-ruby: hsl(354, 84%, 57%);        /* High Pain / Excessive Angle */
  --royal-indigo: hsl(243, 75%, 59%);      /* Clinical / Doctor Dashboard */

  /* Text & Contrast */
  --text-primary: hsl(210, 40%, 98%);
  --text-secondary: hsl(215, 20%, 75%);
  --text-muted: hsl(215, 16%, 50%);
}
```

---

## 2. Screen-by-Screen UI Blueprints & Layouts

### 2.1 Screen 1: Patient Clinical Onboarding Flow
- **Header**: Progress bar (Step 1 to Step 4) + Clean back action.
- **Section 1: Vitals & Demographics**: Name, Age, Gender, Height, Weight, Lifestyle.
- **Section 2: Medical Conditions**: Multi-select pills (Diabetes, Osteoporosis, Hypertension, Arthritis, etc.).
- **Section 3: Baseline Pain & Prescription**: Interactive 0–10 Visual Analog Scale (VAS) slider with dynamic emojis (`😀 0` $\to$ `😣 10`). Prescription drag-and-drop / camera scanner with real-time OCR extraction.

```
+-------------------------------------------------------------+
| [<-] Step 2 of 4: Medical History                [Skip]     |
|                                                             |
| # Tell us about your condition                              |
| Prior Injuries & Surgeries                                  |
| [ + ACL Reconstruction (Right Knee) - 3 weeks ago ]         |
|                                                             |
| Current Pain Level at Rest (0-10)                           |
| [====================( 4 )-----------------] 😐 Moderate    |
|                                                             |
| Upload Doctor's Prescription (Optional)                     |
| +---------------------------------------------------------+ |
| | [ 📄 Prescription_DrSharma.pdf ]  (Extracted: Knee Flex)| |
| +---------------------------------------------------------+ |
|                                                             |
| [ Continue to Recovery Area -> ]                            |
+-------------------------------------------------------------+
```

---

### 2.2 Screen 2: Interactive Anatomical Recovery Area & Condition Selector
- **3D Anatomical Body Map**: Interactive rotating 3D avatar or vector silhouette.
- **Segment Click**: Clicking Knee highlights the joint and slides in condition options:
  - ACL Reconstruction, Meniscus Repair, Total Knee Replacement, Patellar Tendinitis, Arthritis, Ligament Strain.

```
+-------------------------------------------------------------+
| # Select Recovery Area                                      |
| Tap the body zone requiring rehabilitation:                 |
|                                                             |
|            (   ) Head / Neck                                |
|          / | | \ Shoulder & Rotator Cuff                    |
|         /  | |  \ Elbow & Wrist                             |
|        (   |*|   ) Spine / Lumbar                           |
|           /   \  Hip & Pelvis                               |
|          [ * ]   KNEE (Selected)                            |
|          |   |   Ankle & Foot                               |
|                                                             |
| Selected: Right Knee                                        |
| Choose Specific Condition:                                  |
| [ (x) ACL Surgery ]  [ ( ) Meniscus ]  [ ( ) Knee Replace ] |
| [ ( ) Osteoarthritis ] [ ( ) Patellar Strain ]              |
|                                                             |
| [ Generate AI Personalized Plan -> ]                        |
+-------------------------------------------------------------+
```

---

### 2.3 Screen 3: AI Recovery Plan Hub & Predictive Milestone Forecast
- **Header**: Recovery Goal (e.g., *Full 130° Knee Flexion & Unassisted Walking*).
- **Prediction Widget**:
  - `Estimated Recovery: 7.5 Weeks` | `Adherence: 94%` | `Risk of Delay: Low`.
- **Weekly Progression Carousel**:
  - **Week 1 (Active)**: 5 Exercises, 8 Reps, Target Flexion 60°.
  - **Week 2**: 7 Exercises, 12 Reps, Target Flexion 90°.
  - **Week 3 (Locked)**: Resistance band integration.
- **Action Button**: `[ Start Today's Session (20 Mins) ]`.

---

### 2.4 Screen 4: Live Workout Camera HUD (Real-Time AI Coach)
This is the core interactive screen during exercise sessions.

```
+-------------------------------------------------------------+
| [X] Exit     [ 🎙️ Voice: ON ]            [ 🆘 EMERGENCY ]   |
|                                                             |
|  +-------------------------------------------------------+  |
|  | [ LIVE CAMERA FEED ]                                  |  |
|  |                                                       |  |
|  |       O  (Head)                                       |  |
|  |      /|\                                              |  |
|  |     / | \                                             |  |
|  |    /  |  \                                            |  |
|  |      / \                                              |  |
|  |     /   \                                             |  |
|  |    /     \===[ 72° / Target 90° ] (Arc Indicator)     |  |
|  |                                                       |  |
|  | [ AR Ghost Hologram showing correct path ]            |  |
|  +-------------------------------------------------------+  |
|                                                             |
| [ Rep 6 / 10 ]  MQS: 92% (Excellent)   Pain: [ 😀 None ]   |
|                                                             |
| 💬 AI Coach: "Bend your knee 15° more. Keep back straight." |
| [ || Pause ]          [ 🔊 Voice Waveform: Active ]         |
+-------------------------------------------------------------+
```

#### HUD UI Elements:
1. **Dynamic Joint Arc Gauge**: Floating SVG angle indicator attached to the tracking landmark. Turns Green when within target degrees, Cyan when approaching, Red when exceeding safe angle.
2. **Motion Quality Score (MQS) Ring**: Live circular progress bar displaying current repetition quality in real time.
3. **Live Voice Waveform HUD**: Glowing soundwave pulsating synchronously as the AI coach speaks.
4. **AR Trajectory Guide (Ghost Avatar)**: Semi-transparent reference limb demonstrating the smooth movement trajectory.
5. **Emergency Button**: Prominent red quick-action button in upper right corner.

---

### 2.5 Screen 5: AI Recovery Report & Manual Workout Log
- **Manual Entry Table**: Glassmorphic table overlaid directly inside the camera/workout tab for logging off-camera exercises.
- **Dropdown Integration**: Quick-select `<select>` menus for exercises (e.g., Squats, Glute Bridges) pre-populated from the biomechanical configuration.
- **AI Synthesis Button**: A prominent emerald green action button `[ Generate AI Recovery Report ]`.
- **AI Insight Box**: Generates a simulated NLP summary evaluating total volume, posture breakdown, and personalized recommendations (e.g., *Apply ice for 5 minutes*).

---

### 2.6 Screen 6: 3D Digital Twin Recovery Visualizer
- **Interactive 3D Body Mesh**: Pinch, zoom, and rotate the 3D model.
- **Recovery Timeline Slider**:
  - Drag from *Day 1* to *Today*.
  - Visual color shift from **Acute Red** to **Healthy Emerald Green**.
  - Animated joint flexion demonstrates real mobility gain from $45^\circ \to 95^\circ$.
- **Biomechanical Metrics Cards**:
  - `ROM Gain: +50° (+111%)` | `Swelling Index: -65%` | `Stability: 91/100`.

---

### 2.7 Screen 7: Clinician & Doctor Remote Portal (Web)
- **Patient Triage Dashboard**: Sorted by clinical risk (Red: Pain spike $\ge 7$, Yellow: Missed $\ge 2$ sessions, Green: Recovery on schedule).
- **Session Telemetry Inspector**: Full kinematic timeline playback showing Angle vs. Time graphs, MQS curves, and video keyframes.
- **Plan Adjustment Drawer**: Direct slider controls to update Max Angle, Set Count, or assign new rehab protocols with 1-click sync to patient app.
- **One-Click Clinical PDF Report**: Generates insurance-compliant PDF with clinician e-signature.

---

### 2.8 Screen 8: Caregiver & Family Portal
- **Daily Digest Card**: *"John completed his 20-minute knee therapy today at 10:15 AM. Pain level: Mild (2/10). Recovery progress: 68%."*
- **Quick Cheer Button**: Send motivational audio or sticker message directly to the patient's workout screen.
- **Safety Status**: Live status indicator (Normal / In-Session / Incident Flag).
