import { ArrowLeft, Activity, Brain, Shield, Sparkles, HeartPulse, Stethoscope, Cpu, Database, Network } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand/20">
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-border bg-white/60 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">NeuroPhys</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-brand-muted">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <Link href="/#solutions" className="hover:text-brand transition-colors">Care Hub</Link>
            <Link href="/how-it-works" className="text-brand font-semibold transition-colors">How it works</Link>
            <Link href="/#about" className="hover:text-brand transition-colors">About Us</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-16 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="container relative mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-brand-dark">
            The Technology Behind<br />
            <span className="text-brand">Intelligent Care</span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted leading-relaxed mb-8">
            Explore the edge AI, biomechanics, and cloud architectures powering our 5 integrated health modules.
          </p>
        </div>
      </section>

      {/* Modules Detailed Breakdown */}
      <section className="py-20 bg-background relative">
        <div className="container mx-auto px-6 max-w-5xl space-y-24">
          
          {/* Module 1: PhysioAI */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-brand-surface border border-brand-border rounded-full px-3 py-1">
                <Activity className="w-4 h-4 text-brand" />
                <span className="text-xs font-bold text-brand uppercase tracking-wider">Module 01</span>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark">PhysioAI: Autonomous Kinematics</h2>
              <p className="text-brand-muted leading-relaxed">
                PhysioAI utilizes MediaPipe to perform sub-50ms 3D pose estimation directly on the patient's device (Edge AI). It tracks 33 critical skeletal joints in real-time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Cpu className="w-5 h-5 text-brand mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Edge Inference:</strong> Analyzes video frames locally to ensure zero latency and absolute patient privacy.</p>
                </li>
                <li className="flex items-start">
                  <Activity className="w-5 h-5 text-brand mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Biomechanical Scoring:</strong> Compares patient joint angles against dynamic ideal templates, scoring motion quality.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-brand-light to-white">
                 <Activity className="w-24 h-24 text-brand opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 2: Snowie */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-purple-50 border border-purple-100 rounded-full px-3 py-1">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Module 02</span>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark">Snowie: Behavioral Telemetry</h2>
              <p className="text-brand-muted leading-relaxed">
                Snowie is an adaptive engine for neurodevelopmental therapy. It silently analyzes gaze stability, posture, and frustration markers while a child interacts with digital therapies.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Adaptive Difficulty:</strong> Uses reinforcement learning to dynamically alter game difficulty based on attention span.</p>
                </li>
                <li className="flex items-start">
                  <Database className="w-5 h-5 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Longitudinal Tracking:</strong> Aggregates micro-behaviors into comprehensive clinical charts for therapists.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-50 to-white">
                 <Brain className="w-24 h-24 text-purple-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 3: NeuroConnect */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 rounded-full px-3 py-1">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Module 03</span>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark">NeuroConnect: Telehealth Bridge</h2>
              <p className="text-brand-muted leading-relaxed">
                A secure, low-latency WebSocket and WebRTC infrastructure that links the patient's Edge AI telemetry directly to a clinician's dashboard in real-time.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Network className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Encrypted Streams:</strong> End-to-end encrypted bi-directional streams for live video and data telemetry.</p>
                </li>
                <li className="flex items-start">
                  <Shield className="w-5 h-5 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>EMR Integration:</strong> Seamlessly exports session data via FHIR standards to existing hospital records.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
                 <Shield className="w-24 h-24 text-blue-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 4: VitalSync */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1">
                <HeartPulse className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">Module 04</span>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark">VitalSync: Cloud Analytics</h2>
              <p className="text-brand-muted leading-relaxed">
                VitalSync ingests high-frequency data from external IoT wearables alongside our vision telemetry to create a holistic physiological profile.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <HeartPulse className="w-5 h-5 text-rose-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Sensor Fusion:</strong> Combines optical heart rate, HRV, and movement data to detect physiological stress.</p>
                </li>
                <li className="flex items-start">
                  <Activity className="w-5 h-5 text-rose-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Anomaly Detection:</strong> Triggers immediate alerts if patient vitals deviate from safe baseline thresholds.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-rose-50 to-white">
                 <HeartPulse className="w-24 h-24 text-rose-500 opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 5: CarePredict */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                <Stethoscope className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Module 05</span>
              </div>
              <h2 className="text-3xl font-bold text-brand-dark">CarePredict: ML Forecasting</h2>
              <p className="text-brand-muted leading-relaxed">
                Using Generative AI and deep learning, CarePredict analyzes historical session data to forecast recovery timelines and intelligently adjust care plans.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Brain className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Generative LLMs:</strong> Uses AWS Bedrock and Claude to write human-readable clinical summaries automatically.</p>
                </li>
                <li className="flex items-start">
                  <Stethoscope className="w-5 h-5 text-emerald-500 mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Trajectory Modeling:</strong> Predicts patient fatigue and suggests optimal rest periods before injury occurs.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">
                 <Stethoscope className="w-24 h-24 text-emerald-500 opacity-20" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white mt-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Activity className="w-5 h-5 text-brand" />
            <span className="font-bold text-brand-dark">NeuroPhys</span>
          </div>
          <p className="text-sm text-brand-muted">
            &copy; 2026 NeuroPhys AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
