"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { AnnouncementCard } from "@/components/announcement-card";
import type { Announcement } from "@/components/announcement-card";
import { Newspaper } from "lucide-react";

export default function LocalNewsPage() {
  const supabase = createClient();
  const [localNews, setLocalNews] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLocalNews = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("local_news")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching local news:", error);
    } else {
      setLocalNews(data || []);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchLocalNews();
  }, [fetchLocalNews]);

  return (
    <main className="flex justify-center bg-slate-50 px-6 py-16">
      <div className="w-full max-w-6xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#1976D2] flex justify-center items-center gap-2">
            <Newspaper className="w-8 h-8 text-[#1976D2]" />
            Local News
          </h1>
          <p className="text-gray-600 mt-2">
            Stay updated with the latest local news in your barangay.
          </p>
        </div>

        {isLoading ? (
          <p className="text-center text-gray-500">Loading news...</p>
        ) : localNews.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {localNews.map((news) => (
              <AnnouncementCard key={news.id} announcement={news} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No news available.</p>
        )}
      </div>
    </main>
  );
}
