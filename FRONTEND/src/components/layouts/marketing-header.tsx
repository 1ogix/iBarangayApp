"use client";

// src/components/layouts/marketing-header.tsx
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export function MarketingHeader() {
  const [active, setActive] = useState("/");

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Services", href: "#services" },
    { name: "Announcements", href: "#announcements" },
    { name: "About Us", href: "#about" },
    { name: "Visit Us", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#131E3A] shadow-[0_4px_8px_rgba(25,118,210,0.20)] transition-all duration-300">
      <div className="w-full flex h-20 items-center px-8">
        {/* === Left Section: Logo + Navigation === */}
        <div className="flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/Logo.svg" alt="BrgyGo Logo" width={130} height={38} />
          </Link>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center gap-20 text-lg text-white font-medium relative">
            {menuItems.map((item) => (
              <div
                key={item.name}
                className="relative cursor-pointer"
                onClick={() => setActive(item.href)}
              >
                <Link
                  href={item.href}
                  className={`transition-colors duration-300 ${
                    active === item.href ? "text-white" : "text-white"
                  }`}
                >
                  {item.name}
                </Link>

                {/* Underline animation */}
                {active === item.href && (
                  <motion.div
                    layoutId="underline"
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* === Right Section: Buttons === */}
        <div className="flex flex-row gap-4 ml-auto">
          {/* Login Button */}
          <Button
            asChild
            size="lg"
            className="bg-[#131E3A] text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-white hover:text-[#131E3A] border border-white"
          >
            <Link href="/login">Login</Link>
          </Button>

          {/* Sign Up Button */}
          <Button
            asChild
            size="lg"
            variant="outline"
            className="bg-white text-[#131E3A] font-semibold px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-[#1976D2]/60 hover:text-white border border-[#1976D2]/60"
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
