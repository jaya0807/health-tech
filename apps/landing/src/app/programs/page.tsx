"use client";

import { Activity, Brain, Shield, HeartPulse, Stethoscope, Lock } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const platforms = [
  { 
    id: "physio", 
    title: "PhysioAI", 
    desc: "Autonomous physical therapist with 3D kinematics and voice coaching", 
    icon: Activity, 
    color: "text-brand",
    bg: "bg-brand-light",
    border: "border-brand-border",
    href: process.env.NEXT_PUBLIC_PHYSIO_URL || "http://localhost:3001"
  },
  { 
    id: "snowie", 
    title: "Snowie", 
    desc: "AI-driven behavioral tracking for neurodevelopmental care and autism", 
    icon: Brain, 
    color: "text-brand",
    bg: "bg-brand-light",
    border: "border-brand-border",
    href: process.env.NEXT_PUBLIC_SNOWIE_URL || "http://localhost:3002"
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

export default function Programs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % platforms.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-brand/20 flex flex-col">
      <div className="flex-1 pt-24">
        {/* Overlapping Carousel Solutions Section */}
        <section id="solutions" className="py-24 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-brand-dark">Integrated Platform Suite</h2>
              <p className="text-brand-muted">A unified ecosystem of specialized health tech modules</p>
            </div>

            <div
              className="relative w-full max-w-5xl mx-auto h-[350px] flex items-center justify-center"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {platforms.map((platform, i) => {
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
                          <h3 className="text-lg font-bold tracking-tight mb-2 text-brand-dark">{platform.title}</h3>
                          <p className="text-sm text-brand-muted leading-relaxed">
                            {platform.desc}
                          </p>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 mt-2 opacity-60">
                          <div className="flex items-center text-slate-500 font-semibold mb-1">
                            <Lock className="w-4 h-4 mr-1.5" />
                            <span>Locked</span>
                          </div>
                          <h3 className="text-xl font-bold text-slate-700">Coming Soon</h3>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            This module will be available in a future update
                          </p>
                        </div>
                      )}
                      
                      {offset === 0 && platform.title && platform.href && (
                        <a 
                          href={platform.href} 
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`mt-6 w-full py-2.5 rounded-xl ${platform.bg} ${platform.color} font-semibold transition-colors border ${platform.border} hover:opacity-80 block text-center`}
                        >
                          Learn More
                        </a>
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
      </div>

      
    </div>
  );
}
