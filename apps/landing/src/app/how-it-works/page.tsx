import { ArrowLeft, Activity, Brain, Shield, Sparkles, HeartPulse, Stethoscope, Cpu, Database, Network, Lock } from "lucide-react";
import Link from "next/link";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand/20">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="container relative mx-auto px-6 text-center max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-brand-dark">
            The Technology Behind<br />
            <span className="text-brand">Intelligent Care</span>
          </h1>
          <p className="text-base md:text-lg text-brand-muted leading-relaxed mb-8">
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
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark">PhysioAI: Autonomous Kinematics</h2>
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
              <div className="inline-flex items-center space-x-2 bg-brand-light border border-brand-border rounded-full px-3 py-1">
                <Brain className="w-4 h-4 text-brand" />
                <span className="text-xs font-bold text-brand uppercase tracking-wider">Module 02</span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-brand-dark">Snowie: Behavioral Telemetry</h2>
              <p className="text-brand-muted leading-relaxed">
                Snowie is an adaptive engine for neurodevelopmental therapy. It silently analyzes gaze stability, posture, and frustration markers while a child interacts with digital therapies.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Sparkles className="w-5 h-5 text-brand mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Adaptive Difficulty:</strong> Uses reinforcement learning to dynamically alter game difficulty based on attention span.</p>
                </li>
                <li className="flex items-start">
                  <Database className="w-5 h-5 text-brand mt-1 mr-3 flex-shrink-0" />
                  <p className="text-sm text-brand-dark"><strong>Longitudinal Tracking:</strong> Aggregates micro-behaviors into comprehensive clinical charts for therapists.</p>
                </li>
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-brand-light to-white">
                 <Brain className="w-24 h-24 text-brand opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 3: Placeholder */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 opacity-60">
              <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module 03</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold tracking-tight text-slate-700">Locked</h2>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-md">
                This module will be available in a future update.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                 <Shield className="w-24 h-24 text-slate-400 opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 4: Placeholder */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 space-y-6 opacity-60">
              <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
                <HeartPulse className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module 04</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold tracking-tight text-slate-700">Locked</h2>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-md">
                This module will be available in a future update.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                 <HeartPulse className="w-24 h-24 text-slate-400 opacity-20" />
              </div>
            </div>
          </div>

          {/* Module 5: Placeholder */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 opacity-60">
              <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 rounded-full px-3 py-1">
                <Stethoscope className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Module 05</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500">
                <Lock className="w-6 h-6" />
                <h2 className="text-2xl font-bold tracking-tight text-slate-700">Locked</h2>
              </div>
              <p className="text-slate-500 leading-relaxed max-w-md">
                This module will be available in a future update.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="glass-panel h-72 w-full rounded-2xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
                 <Stethoscope className="w-24 h-24 text-slate-400 opacity-20" />
              </div>
            </div>
          </div>

        </div>
      </section>

      
    </div>
  );
}
