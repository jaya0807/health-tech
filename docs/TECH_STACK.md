# 🛠️ Health-Tech Platform Tech Stack

This document outlines the comprehensive technology stack utilized across the entire health-tech platform (Care Hub, PhysioAI, and Snowie). The architecture is designed for **extreme low-latency**, **medical-grade privacy**, and **cloud-native scalability**.

---

## 1. 🖥️ Frontend & UI Architecture
The user-facing applications are built on modern, high-performance React frameworks to ensure a highly responsive, app-like experience on web and mobile browsers.

*   **Next.js 15 (App Router):** Powers the main **Care Hub** landing application and the **Snowie** neurodevelopmental dashboard. Used for its robust routing, server-side rendering (SSR), and seamless API integration.
*   **Vite + React 19:** Powers **PhysioAI**. Chosen for its lightning-fast Hot Module Replacement (HMR) and highly optimized WebAssembly (Wasm) bundling necessary for heavy client-side kinematic tracking.
*   **Tailwind CSS v4:** The utility-first CSS framework used globally for styling. The platform utilizes a strictly enforced, glassmorphic `brand` design system.
*   **Lucide React:** A lightweight, scalable SVG icon library used across all applications for a clean, medical-enterprise aesthetic.

---

## 2. 🧠 Edge AI & Computer Vision
Instead of streaming heavy video to the cloud, the platform processes complex biometric data directly on the user's device (Edge Computing) to ensure **zero-latency** and **maximum privacy (Zero Video Retention)**.

*   **Google MediaPipe:** The core engine for all computer vision tasks. 
    *   *PhysioAI:* Utilizes the **33-point Pose Detection** model to track joint angles, flexion, and range of motion.
    *   *Snowie:* Utilizes the **Face Mesh & Hand Tracking** models to detect gaze aversion, blinking rates, and repetitive stimming movements.
*   **WebAssembly (Wasm) & WebGL:** Allows the heavy MediaPipe machine learning models to run directly inside the browser's GPU/CPU at 60 FPS without installing native applications.
*   **Custom Biomechanical State Machines:** Proprietary algorithms built in TypeScript/Python that parse the raw MediaPipe coordinates to evaluate "Motion Quality Scores" (MQS) and psychological frustration metrics.

---

## 3. 🌐 Backend & Telemetry
The backend is designed exclusively for lightweight telemetry handling, WebRTC signaling, and database management, completely avoiding heavy video processing.

*   **Python 3 & FastAPI:** The core backend framework. Chosen for its extreme speed, asynchronous capabilities (`asyncio`), and native integration with AI/ML Python ecosystems.
*   **WebSockets:** Facilitates real-time, bi-directional telemetry streams (e.g., sending joint-angle anomalies or frustration spikes to the server instantly).
*   **WebRTC (Peer-to-Peer):** Used specifically for the **Live Parent Monitor** in Snowie. Establishes a direct, end-to-end encrypted video stream between the child's tablet and the parent's phone, bypassing cloud compute entirely.
*   **SQLite / PostgreSQL:** Handles relational data storage for patient profiles, session logs, and medical adherence tracking.

---

## 4. ☁️ Cloud & Infrastructure (AWS)
The platform is designed to be fully cloud-native on Amazon Web Services (AWS), utilizing managed services for compliance and automated clinical reporting.

*   **AWS Bedrock (Claude LLM):** The generative AI engine. It consumes the lightweight JSON telemetry files from a completed session and autonomously synthesizes professional, medical-grade PDF progress reports for doctors and parents.
*   **AWS ECS / Fargate:** Serverless container orchestration. Used to host the FastAPI signaling servers and telemetry ingest endpoints without managing underlying EC2 instances.
*   **AWS API Gateway & Lambda:** Serverless architecture used to handle lightweight REST requests (e.g., fetching a patient's historical recovery timeline).
*   **AWS CloudFront & S3:** The global Content Delivery Network (CDN) used to serve the Next.js and Vite static assets with ultra-low latency worldwide.

---

## 5. ⚙️ DevOps & Tooling
*   **Docker & Docker Compose:** Containerizes the multiple microservices (Landing, PhysioAI, Snowie, Backend) ensuring perfect parity between local development and AWS production.
*   **Concurrently:** A Node.js utility used in the root monorepo to orchestrate and boot all micro-frontends simultaneously on different ports (3000, 3001, 3002).
*   **Git:** Version control, with strict branching strategies (`main` for production, `development` for active engineering).
