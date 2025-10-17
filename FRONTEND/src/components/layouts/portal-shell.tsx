import Image from "next/image";
import Link from "next/link";

import type { NavSection } from "@/config/navigation";
import { SidebarNav } from "@/components/navigation/sidebar-nav";

interface PortalShellProps {
  sections: NavSection[];
  children: React.ReactNode;
}

export function PortalShell({ sections, children }: PortalShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr] bg-muted/30">
      <aside className="flex flex-col border-r bg-[#025AAE] px-6 py-8">
        <Link href="/" className="mb-6 flex items-center gap-3">
          <div>
            <Image
              src="/logo.svg"
              alt="BrgyGo logo"
              width={48}
              height={48}
              className="h-full w-full object-contain"
            />
          </div>
          {/* <div>
            <p className="text-lg font-bold">BrgyGo</p>
            <p className="text-xs text-muted-foreground">Barangay services portal</p>
          </div> */}
        </Link>
        <SidebarNav sections={sections} />
      </aside>
      <main className="flex flex-col gap-6 px-10 py-10">
        {children}
      </main>
    </div>
  );
}
