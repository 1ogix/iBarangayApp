// src/components/layouts/marketing-header.tsx
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function MarketingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          {/* Assume you have 'logo.svg' in your public folder */}
          <Image src="/Logo.svg" alt="BrgyGo Logo" width={139} height={40} />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-lg text-primary-foreground font-medium">
          <Link href="#services" className="hover:text-primary">
            Services
          </Link>
          <Link href="#announcements" className="hover:text-primary">
            Announcements
          </Link>
          <Link href="#about" className="hover:text-primary">
            About Us
          </Link>
          <Link href="#contact" className="hover:text-primary">
            Visit Us
          </Link>
        </nav>
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
            <Link href="/sign-up">Sign Up</Link>
        </Button>
      </div>
    </header>
  );
}