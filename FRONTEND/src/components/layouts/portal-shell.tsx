"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import type { NavSection } from "@/config/navigation";
import { SidebarNav } from "@/components/navigation/sidebar-nav";
import { cn } from "@/lib/utils";

interface PortalShellProps {
  sections: NavSection[];
  children: React.ReactNode;
}

export function PortalShell({ sections, children }: PortalShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-primary/10 bg-[#131E3A] px-4 py-3 shadow-sm backdrop-blur lg:hidden">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/Logo.svg"
            alt="BrgyGo logo"
            width={140}
            height={120}
            className="h-[auto] w-[140px] object-contain"
          />
        </Link>
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
          className="rounded-md border bg-gray-50 border-gray-200 p-2 text-gray-800 shadow-sm transition active:scale-95"
        >
          {isSidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[280px_1fr]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-72 -translate-x-full bg-[#025AAE] px-6 py-8 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 lg:border-r lg:bg-[#025AAE]",
            "flex flex-col",
            isSidebarOpen && "translate-x-0"
          )}
        >
          <Link href="/" className="mb-8 flex items-center gap-3">
            <Image
              src="/Logo.svg"
              alt="BrgyGo logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </Link>
          <SidebarNav sections={sections} />
        </aside>
        <main className="flex flex-col gap-6 px-4 py-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
