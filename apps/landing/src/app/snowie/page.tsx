"use client";

import { Brain, Activity, Sparkles, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function SnowiePage() {
  const appUrl = process.env.NEXT_PUBLIC_SNOWIE_URL || "http://localhost:3002";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand-light0/20">
      {/* Navigation */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="container relative mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-brand-dark">
            Meet <span className="text-brand">Snowie</span>
          </h1>
          <p className="text-base md:text-lg text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-driven behavioral tracking and therapy adaptation. 
            Snowie engages children through gamified activities while continuously analyzing real-time biometric telemetry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <a 
              href={appUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 text-sm btn-primary font-semibold flex items-center justify-center rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors shadow-sm"
            >
              Launch Snowie
            </a>
            <Link href="/" className="w-full sm:w-auto px-6 py-3 text-sm font-semibold flex items-center justify-center rounded-xl bg-white border border-brand-border text-brand-dark hover:bg-brand-light transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-brand-surface relative overflow-hidden border-t border-brand-border/50">
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-dark">Adaptive Telemetry Engine</h2>
            <p className="text-brand-muted">Continuous real-time behavioral tracking during gameplay.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Brain className="w-6 h-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-slate-800">Dynamic Adaptation</h4>
              <p className="text-sm text-slate-500">Instantly scales difficulty and sensory load based on real-time cognitive state and frustration levels.</p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <HeartPulse className="w-6 h-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-slate-800">Live Telemetry</h4>
              <p className="text-sm text-slate-500">Tracks head posture, gaze aversions, and repetitive movements seamlessly from the device camera.</p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Sparkles className="w-6 h-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-slate-800">Clinical Reports</h4>
              <p className="text-sm text-slate-500">Powered by AWS Bedrock to synthesize raw session metrics into actionable progression reports.</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
