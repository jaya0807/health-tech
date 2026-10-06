"use client";

import { Activity, Brain, Sparkles, ShieldCheck, EyeOff, Lock } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand/20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="container relative mx-auto px-6 text-center max-w-5xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight text-brand-dark">
            Smarter Rehabilitation,<br />
            <span className="text-brand">
              Better Progress
            </span>
          </h1>
          <p className="text-base md:text-lg text-brand-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            A unified platform for child rehabilitation and physical therapy, combining guided activities, movement analysis, and meaningful progress tracking
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/programs" className="w-full sm:w-auto px-6 py-3 text-sm btn-primary font-semibold flex items-center justify-center">
              Explore Rehabilitation
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto px-6 py-3 text-sm btn-secondary font-semibold flex items-center justify-center">
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-brand-surface relative overflow-hidden border-t border-brand-border/50">
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-dark">Powered by Edge AI</h2>
            <p className="text-brand-muted">Zero-latency computer vision and real-time behavioral telemetry</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Activity className="w-6 h-6 text-brand" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">3D Skeletal Tracking</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                Utilizing MediaPipe for 33-point pose estimation with sub-50ms latency directly on the edge
              </p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Brain className="w-6 h-6 text-brand-accent" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">Generative AI Reports</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                AWS Bedrock & Claude LLM synthesize raw telemetry into clinical-grade progression reports
              </p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Sparkles className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">WebSocket Telemetry</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                High-frequency bi-directional streams for real-time difficulty adaptation and live parent monitoring
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Trust & Security Section */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-brand-border/50">
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-dark">Clinical Trust & Security</h2>
            <p className="text-brand-muted">Built from the ground up for medical-grade privacy and compliance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-6 text-brand">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">HIPAA Ready Architecture</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                All telemetry data is anonymized and encrypted in transit and at rest using AES-256 standards.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-6 text-brand">
                <EyeOff className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">Zero Video Retention</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                Video is processed instantly on the edge (WebAssembly) or routed via secure WebRTC. Raw video is never saved to the cloud.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mb-6 text-brand">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">End-to-End Encryption</h4>
              <p className="text-sm text-brand-muted leading-relaxed">
                The Live Parent Monitor utilizes direct Peer-to-Peer (P2P) connections, ensuring only authorized guardians can view the stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent opacity-50"></div>
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-left mb-8 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-white">
                Ready to transform your recovery?
              </h2>
              <p className="text-base text-brand-light/90 max-w-xl">
                Experience the future of autonomous rehabilitation and neurodevelopmental therapy today.
              </p>
            </div>
            <Link href="/programs" className="w-full md:w-auto px-8 py-4 text-base font-bold flex items-center justify-center rounded-xl bg-white text-brand hover:bg-slate-50 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 duration-300 flex-shrink-0">
              Launch Care Hub
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
