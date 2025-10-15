'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement-card";
import type { Announcement } from "@/components/announcement-card";
import { Newspaper, Briefcase, Database } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatSupabaseDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const fetchAnnouncements = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3); // Fetch only the 3 most recent announcements

    if (error) {
      console.error("Error fetching announcements for landing page:", error);
    } else if (data) {
      const formattedData = data.map(item => ({
        ...item,
        imageUrl: item.image_url ?? "",
        date: formatSupabaseDate(item.created_at),
      }));
      setAnnouncements(formattedData);
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  return (
    <section className="flex flex-1 flex-col items-center gap-8 bg-slate-50 px-6 py-24 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="z-10 max-w-2xl space-y-4">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          BrgyGo
        </span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl font-bold text-slate-900 sm:text-5xl md:text-6xl">
          Digitize services for a smarter barangay community.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-slate-600">
          Manage citizen requests, appointments, announcements, and operations in one secure platform. Empower staff with the right tools while giving residents a delightful digital experience.
        </motion.p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/login">Access Portal</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#features">Explore Features</Link>
        </Button>
      </motion.div>
      <motion.div 
        id="features"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }} className="grid max-w-4xl gap-6 rounded-2xl border bg-white p-8 text-left shadow-sm md:grid-cols-3">
        {[
          {
            title: "Citizen Services",
            description: "Apply for documents, track requests, and book appointments online.",
            icon: <Newspaper className="h-8 w-8 text-blue-600" />
          },
          {
            title: "Operations Hub",
            description: "Streamline approvals, records, payments, and community broadcasts.",
            icon: <Briefcase className="h-8 w-8 text-blue-600" />
          },
          {
            title: "Supabase Ready",
            description: "Built to integrate with Supabase for auth, data, and automation.",
            icon: <Database className="h-8 w-8 text-blue-600" />
          }
        ].map((feature) => (
          <div key={feature.title} className="space-y-2">
            {feature.icon}
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </motion.div>
      <div id="announcements" className="w-full max-w-4xl space-y-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Latest Announcements</h2>
          <p className="text-muted-foreground">Stay updated with the latest news and announcements from your barangay.</p>
        </div>
        {isLoading ? (
          <p>Loading announcements...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {announcements.map((announcement, i) => (
              <AnnouncementCard key={i} announcement={announcement} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
