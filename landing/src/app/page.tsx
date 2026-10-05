"use client";

import { ArrowRight, Activity, Brain, Shield, Sparkles, ChevronLeft, ChevronRight, HeartPulse, Stethoscope } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const platforms = [
  { 
    id: "physio", 
    title: "PhysioAI", 
    desc: "Autonomous physical therapist with 3D kinematics and voice coaching.", 
    icon: Activity, 
    color: "text-brand",
    bg: "bg-brand-light",
    border: "border-brand-border"
  },
  { 
    id: "snowie", 
    title: "Snowie", 
    desc: "AI-driven behavioral tracking for neurodevelopmental care and autism.", 
    icon: Brain, 
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100"
  },
  { 
    id: "empty1", 
    title: "", 
    desc: "", 
    icon: Shield, 
    color: "text-slate-300",
    bg: "bg-slate-50",
    border: "border-slate-100"
  },
  { 
    id: "empty2", 
    title: "", 
    desc: "", 
    icon: HeartPulse, 
    color: "text-slate-300",
    bg: "bg-slate-50",
    border: "border-slate-100"
  },
  { 
    id: "empty3", 
    title: "", 
    desc: "", 
    icon: Stethoscope, 
    color: "text-slate-300",
    bg: "bg-slate-50",
    border: "border-slate-100"
  },
];

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % platforms.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + platforms.length) % platforms.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % platforms.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand/20">
      {/* Navigation */}
      <nav className="fixed w-full z-50 border-b border-border bg-white/60 backdrop-blur-md">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-brand-dark">NeuroPhys</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-brand-muted">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>
            <Link href="/#solutions" className="hover:text-brand transition-colors">Care Hub</Link>
            <Link href="/how-it-works" className="hover:text-brand transition-colors">How it works</Link>
            <Link href="/#about" className="hover:text-brand transition-colors">About Us</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-52 md:pb-24 overflow-hidden bg-brand-light">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-transparent to-transparent opacity-60"></div>
        <div className="container relative mx-auto px-6 text-center max-w-5xl">
          <div className="inline-flex items-center space-x-2 bg-white border border-brand-border rounded-full px-4 py-1.5 mb-8 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-accent" />
            <span className="text-sm font-medium text-brand-muted">Next-Generation AI Health Platforms</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight text-brand-dark">
            Intelligent Care,<br />
            <span className="text-brand">
              Beyond Human Limits.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-brand-muted max-w-3xl mx-auto mb-12 leading-relaxed">
            Unifying autonomous physical rehabilitation and behavioral therapy through advanced computer vision, biomechanical analysis, and real-time AI telemetry.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button className="w-full sm:w-auto px-8 py-4 btn-primary font-semibold flex items-center justify-center">
              Explore Solutions
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 btn-secondary font-semibold">
              View Documentation
            </button>
          </div>
        </div>
      </section>

      {/* Overlapping Carousel Solutions Section */}
      <section id="solutions" className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-brand-dark">Integrated Platform Suite</h2>
            <p className="text-brand-muted">A unified ecosystem of specialized health tech modules.</p>
          </div>

          <div className="relative w-full max-w-5xl mx-auto h-[350px] flex items-center justify-center">
            {platforms.map((platform, i) => {
              // Calculate offset relative to active index
              let offset = i - activeIndex;
              if (offset < -2) offset += platforms.length;
              if (offset > 2) offset -= platforms.length;
              
              let translateX = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = 50;
              let rotateY = 0;
              
              if (offset === 0) {
                translateX = 0; scale = 1; opacity = 1; zIndex = 50; rotateY = 0;
              } else if (offset === -1) {
                translateX = -60; scale = 0.85; opacity = 0.8; zIndex = 40; rotateY = 15;
              } else if (offset === 1) {
                translateX = 60; scale = 0.85; opacity = 0.8; zIndex = 40; rotateY = -15;
              } else if (offset === -2) {
                translateX = -110; scale = 0.7; opacity = 0.3; zIndex = 30; rotateY = 30;
              } else if (offset === 2) {
                translateX = 110; scale = 0.7; opacity = 0.3; zIndex = 30; rotateY = -30;
              }

              const Icon = platform.icon;

              return (
                <div 
                  key={platform.id} 
                  className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] cursor-pointer select-none"
                  style={{ 
                    transform: `translateX(${translateX}%) scale(${scale}) perspective(1000px) rotateY(${rotateY}deg)`, 
                    opacity, 
                    zIndex 
                  }}
                  onClick={() => setActiveIndex(i)}
                >
                  <div className={`glass-panel w-[280px] md:w-[340px] h-[260px] p-8 flex flex-col items-center justify-center text-center shadow-2xl hover:shadow-3xl bg-white border ${platform.border}`}>
                    <div className={`w-16 h-16 rounded-2xl ${platform.bg} flex items-center justify-center mb-6 border ${platform.border}`}>
                      <Icon className={`w-8 h-8 ${platform.color}`} />
                    </div>
                    {platform.title ? (
                      <>
                        <h3 className="text-xl font-bold mb-3 text-brand-dark">{platform.title}</h3>
                        <p className="text-sm text-brand-muted leading-relaxed">
                          {platform.desc}
                        </p>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-4 opacity-50 w-full mt-2">
                        <div className="h-5 w-1/2 bg-slate-200 rounded-full animate-pulse"></div>
                        <div className="space-y-2 w-full flex flex-col items-center">
                          <div className="h-3 w-4/5 bg-slate-100 rounded-full animate-pulse"></div>
                          <div className="h-3 w-3/5 bg-slate-100 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                    )}
                    
                    {offset === 0 && platform.title && (
                      <button className={`mt-6 w-full py-2.5 rounded-xl ${platform.bg} ${platform.color} font-semibold transition-colors border ${platform.border} hover:opacity-80`}>
                        Learn More
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

          </div>
          
          <div className="flex justify-center space-x-2 mt-8">
            {platforms.map((_, i) => (
              <button 
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${i === activeIndex ? 'bg-brand' : 'bg-brand-border'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section id="technology" className="py-24 bg-brand-surface relative overflow-hidden border-t border-brand-border/50">
        <div className="container relative mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-brand-dark">Powered by Edge AI</h2>
            <p className="text-brand-muted">Zero-latency computer vision and real-time behavioral telemetry.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Activity className="w-6 h-6 text-brand" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-brand-dark">3D Skeletal Tracking</h4>
              <p className="text-sm text-brand-muted">
                Utilizing MediaPipe for 33-point pose estimation with sub-50ms latency directly on the edge.
              </p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Brain className="w-6 h-6 text-brand-accent" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-brand-dark">Generative AI Reports</h4>
              <p className="text-sm text-brand-muted">
                AWS Bedrock & Claude LLM synthesize raw telemetry into clinical-grade progression reports.
              </p>
            </div>
            <div className="glass-light p-6 flex flex-col items-start hover:-translate-y-1 transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6 shadow-sm border border-brand-border">
                <Sparkles className="w-6 h-6 text-brand-blue" />
              </div>
              <h4 className="text-xl font-bold mb-3 text-brand-dark">WebSocket Telemetry</h4>
              <p className="text-sm text-brand-muted">
                High-frequency bi-directional streams for real-time difficulty adaptation and live parent monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border py-12 bg-white">
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
