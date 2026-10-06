# Algorithmic Pipeline: PhysioCare Engine

This document outlines the core algorithmic pipeline used in the PhysioCare platform to track, analyze, and evaluate patient movements during physiotherapy sessions without the need for specialized hardware.

## 1. Vision Ingestion & Landmark Detection
**Input:** Raw video frames from standard webcams or smartphone cameras.
**Process:** 
- The system captures video at 30-60 FPS.
- A lightweight pose estimation model extracts 33 3D anatomical landmarks (x, y, z coordinates + visibility confidence).
- If confidence drops below 65%, the frame is flagged, and the user is prompted to adjust their position.

## 2. Exponential Smoothing Filter
**Problem:** Raw landmark coordinates often contain micro-jitter and noise, especially on lower-end devices.
**Solution:** An Exponential Moving Average (EMA) filter is applied to the raw coordinates.
```math
Smoothed_t = \alpha \times Raw_t + (1 - \alpha) \times Smoothed_{t-1}
```
Where $\alpha = 0.35$ provides an optimal balance between responsiveness (low latency) and stability (noise reduction).

## 3. 3D Kinematics & Vector Math Engine
**Process:** 
- The system translates smoothed landmarks into 3D bone vectors (e.g., Hip-to-Knee, Knee-to-Ankle).
- **Scale-Invariant Angle Calculation:** Uses the dot product of two vectors to calculate the exact joint angle, independent of the user's distance from the camera.
```math
\cos\theta = \frac{u \cdot v}{\|u\| \|v\|}
```

## 4. Derivative Analysis (Velocity & Jerk)
To ensure movements are smooth and controlled:
- **Velocity:** First derivative of the joint angle over time ($d\theta/dt$).
- **Jerk:** Second derivative of velocity, measuring sudden, uncontrolled changes in acceleration. High jerk values indicate poor control or pain responses.

## 5. Repetition State Machine
A deterministic finite state machine (FSM) tracks the progress of a single repetition to prevent "cheat reps".
- **IDLE:** User is in the starting position.
- **CONCENTRIC:** User is moving towards the target angle.
- **PEAK_HOLD:** User reaches the target angle and must hold for $X$ seconds.
- **ECCENTRIC:** User returns to the starting position in a controlled manner.
- **COMPLETED:** A full, valid rep is counted.

## 6. Form Score (MQS) Calculation
The Motion Quality Score (0-100%) is calculated for every repetition using a weighted composite formula:
- **Range of Motion (40%):** Did they reach the target angle?
- **Smoothness (20%):** Was the movement free of excessive jerk?
- **Pacing (20%):** Was the eccentric/concentric timing consistent?
- **Alignment (20%):** Was bilateral symmetry maintained (e.g., no excessive trunk tilt)?

## 7. Dynamic Adaptation & Safety Fallbacks
- If the MQS drops below 70% consistently, the target angle is dynamically reduced.
- If the patient self-reports pain > 6/10 via voice command or UI, the system halts the exercise to prevent injury.
