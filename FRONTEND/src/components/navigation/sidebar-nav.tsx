"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavSection } from "@/config/navigation";
import { cn } from "@/lib/utils";

interface SidebarNavProps {
  sections: NavSection[];
}

export function SidebarNav({ sections }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-4">
      {sections.map((section) => {
        if (section.items?.length) {
          const isActive = section.items.some((item) => item.href === pathname);
          return (
            <details
              key={section.title}
              // className="rounded-lg border border-border bg-card"
              open={isActive}
            >
              <summary
                className={cn(
                  "cursor-pointer rounded-md list-none px-4 py-2 text-sm text-primary-foreground hover:text-primary font-semibold transition hover:bg-muted",
                  isActive && "bg-muted"
                )}
              >
                {section.title}
              </summary>
              <div className="space-y-1 px-4 pb-3 pt-2 text-sm">
                {section.items.map((item) => {
                  const itemActive = item.href === pathname;
                  return (
                    <Link
                      key={item.title}
                      href={item.href ?? "#"}
                      className={cn(
                        "block rounded-md px-2 py-1.5 transition text-primary-foreground hover:bg-accent hover:text-accent-foreground",
                        itemActive && "bg-primary text-primary-foreground hover:bg-primary"
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </details>
          );
        }

        const isActive = section.href === pathname;
        return (
          <Link
            key={section.title}
            href={section.href ?? "#"}
            className={cn(
              "block rounded-lg border border-transparent px-4 py-2 text-sm text-primary-foreground font-semibold transition hover:bg-accent hover:text-accent-foreground",
              isActive && "border-primary bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
            )}
          >
            {section.title}
          </Link>
        );
      })}
    </nav>
  );
}
