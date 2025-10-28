
// src/components/layouts/marketing-header.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React from "react";

const testAlert = () => {
  alert("Test Alert!");
}

export function MarketingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131E3A] shadow-[0_4px_8px_rgba(25,118,210,0.20)] transition-all duration-300">
      <div className="w-full flex h-20 items-center px-8">
        {/* === Left Section: Logo + Navigation === */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Logo.svg" alt="BrgyGo Logo" width={139} height={40} />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-24 text-lg text-white font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors duration-200">
              Home
            </Link>
            <Link href="#services" className="hover:text-blue-400 transition-colors duration-200">
              Services
            </Link>
            <Link href="#announcements" className="hover:text-blue-400 transition-colors duration-200">
              Announcements
            </Link>
            <Link href="#about" className="hover:text-blue-400 transition-colors duration-200">
              About Us
            </Link>
            <Link href="#contact" className="hover:text-blue-400 transition-colors duration-200">
              Visit Us
            </Link>
          </nav>
        </div>

        {/* === Right Section: Buttons === */}
        <div className="flex flex-row gap-8 ml-auto">
          {/* Login Button — Solid Blue */}
          <Button
            asChild
            size="lg"
            className="bg-[#1976D2] text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-[#1976D2]"
          >
            <Link href="/login">Login</Link>
          </Button>

          {/* Sign Up Button — Outline Style */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-2 border-[#1976D2] text-[#1976D2] hover:bg-[#1976D2] hover:text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}