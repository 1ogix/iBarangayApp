"use client";

import { PageHeader } from "@/components/layouts/page-header";
import { useState, useEffect, useCallback } from "react";
import {
  AnnouncementCard,
  type Announcement,
} from "@/components/announcement-card";
import { createClient } from "@/utils/supabase/client";

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
      <div className="rounded-lg border border-dashed bg-background/60 p-10 text-center text-muted-foreground">
        <h1 className="text-lg font-semibold">Announcements & Advisories</h1>
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center">
            <p className="text-muted-foreground">
              Stay updated with the latest news and announcements from your
              barangay.
            </p>
          </div>
          {isLoading ? (
            <p className="text-center">Loading announcements...</p>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
