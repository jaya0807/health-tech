"use client";

import { Activity, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 border-b border-border bg-white/60 backdrop-blur-md">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-md bg-brand flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-brand-dark">NeuroPhys</span>
        </Link>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center space-x-8 text-sm font-medium text-brand-muted">
          <Link href="/" className={`${pathname === "/" ? "text-brand font-semibold" : "hover:text-brand"} transition-colors`}>
            Home
          </Link>
          
          <div 
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button className={`flex items-center space-x-1 ${pathname === "/physio" || pathname === "/snowie" ? "text-brand font-semibold" : "hover:text-brand"} transition-colors`}>
              <span>Care Hub</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 pt-2 w-48 z-50">
                <div className="bg-white border border-brand-border rounded-xl shadow-lg py-2">
                  <Link href="/physio" className="block px-4 py-2 hover:bg-brand-light hover:text-brand transition-colors text-brand-dark">
                    PhysioAI
                  </Link>
                  <Link href="/snowie" className="block px-4 py-2 hover:bg-brand-light hover:text-brand transition-colors text-brand-dark">
                    Snowie
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/programs" className={`${pathname === "/programs" ? "text-brand font-semibold" : "hover:text-brand"} transition-colors`}>
            Programs
          </Link>

          <Link href="/how-it-works" className={`${pathname === "/how-it-works" ? "text-brand font-semibold" : "hover:text-brand"} transition-colors`}>
            How it works
          </Link>
          
          <Link href="/#about" className="hover:text-brand transition-colors">
            About Us
          </Link>
        </div>
      </div>
    </nav>
  );
}
