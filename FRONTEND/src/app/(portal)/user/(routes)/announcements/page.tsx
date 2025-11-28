"use client";

import { useState, useEffect, useCallback } from "react";
import {
  AnnouncementCard,
  type Announcement,
} from "@/components/announcement-card";
import { createClient } from "@/utils/supabase/client";
import { PageHeader } from "@/components/layouts/page-header";

export default function Page() {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Helper to format date strings from Supabase
  const formatSupabaseDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };
  // Fetch latest 3 announcements from Supabase
  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3);

    if (error) {
      console.error("Error fetching announcements for landing page:", error);
    } else if (data) {
      const formattedData = data.map((item) => ({
        ...item,
        imageUrl: item.image_url ?? "",
        date: formatSupabaseDate(item.created_at),
      }));
      setAnnouncements(formattedData);
    }
    setIsLoading(false);
  }, [supabase]);
  // Fetch announcements on component mount
  // and when fetchAnnouncements changes
  // (which is stable due to useCallback)
  // Thus, this runs only once on mount.
  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements & Advisories"
        description="Latest barangay updates and advisories."
      />

      <div className="overflow-hidden rounded-xl border bg-gradient-to-br from-white to-muted/60 shadow-sm">
        <div className="border-b bg-primary/5 px-4 py-3 text-sm text-primary">
          Stay updated with official news, advisories, and community events.
        </div>

        <div className="space-y-6 p-6">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <div className="rounded-lg border bg-background/80 p-4">
                <div className="h-40 w-full animate-pulse rounded-md bg-muted" />
                <div className="mt-4 h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-3 w-80 animate-pulse rounded bg-muted" />
              </div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border bg-background/80 p-3"
                  >
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-24 animate-pulse rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-muted/40 px-4 py-10 text-center text-muted-foreground">
              No announcements yet. Please check back later.
            </div>
          ) : (
            <>
              {/* Featured latest announcement */}
              <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
                <div className="rounded-xl border bg-background/80 p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-primary">
                    Latest update
                  </p>
                  <h2 className="mt-2 text-xl font-semibold leading-tight">
                    {announcements[0].title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {announcements[0].content}
                  </p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {announcements[0].date}
                  </p>
                </div>

                <div className="rounded-xl border bg-background/80 p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Quick glance
                  </p>
                  <div className="mt-3 space-y-3">
                    {announcements.slice(0, 3).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border bg-muted/40 p-3"
                      >
                        <p className="text-sm font-medium">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.date}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cards grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
