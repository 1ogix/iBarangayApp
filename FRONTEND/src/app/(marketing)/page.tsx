'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement-card";
import { Announcement } from "@/components/announcement-card";
import { Newspaper, Briefcase, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const announcements: Announcement[] = [
    {
      title: "Community Clean-Up Drive",
      content: "Join us this Saturday for a community clean-up drive at the central park. Let's keep our barangay clean and green!",
      imageUrl: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      date: "2023-10-01"
    },
    {
      title: "Barangay Assembly Meeting",
      content: "The next barangay assembly meeting is scheduled for October 15th at 3 PM in the community hall. All residents are encouraged to attend.",
      imageUrl: "",
      date: "2023-10-15"
    }
  ];


  return (
    <section className="relative flex flex-1 flex-col items-center justify-center gap-8 bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
      <div className="absolute inset-0 bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-black/50"></div>
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
          className="text-4xl font-bold sm:text-5xl md:text-6xl text-white">
          Digitize services for a smarter barangay community.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-gray-200">
          Manage citizen requests, appointments, announcements, and operations in one secure platform. Empower staff with the right tools while giving residents a delightful digital experience.
        </motion.p>
      </motion.div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="z-10 flex flex-wrap items-center justify-center gap-4">
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
        transition={{ duration: 0.5, delay: 0.4 }}
        className="z-10 grid max-w-4xl gap-6 rounded-2xl border bg-white p-8 text-left shadow-sm md:grid-cols-3">
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
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {announcements.map((announcement, i) => (
            <AnnouncementCard key={i} announcement={announcement} />
          ))}
        </div>
      </div>
    </section>
  );
}
