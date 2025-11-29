"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { AnnouncementCard } from "@/components/announcement-card";
import type { Announcement } from "@/components/announcement-card";
import { Newspaper, Briefcase, Database } from "lucide-react";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import DotsBackground from "@/components/animation";

// Landing Page Component
export default function LandingPage() {
  const supabase = createClient();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // static datas for the government services section
  const governmentServices = [
    {
      title: "Barangay Services",
      imageUrl:
        "/Cebu_City_Hall_Aerial.jpg",
      description:
        "Access your barangay permits and certificates in one convenient place—fast, simple, and hassle-free.",
    },
    {
      title: "Report a Concern",
      imageUrl:
        "/tanod.jpg",
      description:
        "Help keep the community safe by reporting issues directly to your barangay with just a few taps.",
    },
    {
      title: "Community Announcements",
      imageUrl:
        "/announce.jpg",
      description:
        "Never miss an update—get the latest barangay news, events, and important advisories instantly.",
    },
    {
      title: "Document Downloadables",
      imageUrl:
        "/download.avif",
      description:
        "Easily download official forms and documents whenever you need them—complete with QR verification.",
    },
    
  ];

  return (
    // Use a main tag to wrap all sections for better semantics
    <main className="flex flex-col">
      
      {/* SECTION 1: Hero */}
      <section className="relative flex h-screen flex-col justify-center gap-8 bg-[url('/cebu_city_hall.jpg')] bg-cover bg-center px-5 py-20 text-white md:px-20 md:py-24">
       
       {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-[#1976D2] opacity-60 shadow-[0px_4px_8px_0px_rgba(25,118,210,0.20)]"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="z-10 max-w-[100%] space-y-4"
        >
          <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
            BrgyGo
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl max-w-7xl font-heading font-black italic sm:text-5xl md:text-7xl"
          >
            Brgy
            <span className="text-[#00FFFF]">Go</span>
            : Your Digital Gateway to Barangay Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-thin  text-white font-sans tracking-wide leading-relaxed drop-shadow-md"
          >
            Bringing government services closer to the people of our community.
          </motion.p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-row gap-4"
        >
        
        {/* === Get Started Button === */}
          <Button
            asChild
            className="bg-[#131E3A] text-white text-lg font-semibold px-4 py-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white hover:text-[#131E3A] border-2 border-[#131E3A]"
          >
            <Link href="/signup">Get Started</Link>
          </Button>

        
        {/* === Explore Features Button === */}
          <Button
            asChild
            className="bg-[#1976D2]/10 text-white border-2 border-white text-lg font-semibold px-4 py-4 rounded-xl shadow-md transition-all duration-300 hover:bg-white hover:text-[#131E3A]"
          >
            <Link href="#features">Explore Features</Link>
          </Button>
        </motion.div>
      </section>
    
     {/* SECTION 2: Services */}
      <section
        id="services"
        className="min-h-screen flex flex-col bg-slate-50 px-6 pt-32 pb-32"
      >
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-center text-[#131E3A] mb-3">
          Government Services
        </h2>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Apply for permits, submit concerns, and access official barangay documents—all in one place.
        </p>

        {/* Content - occupies remaining space */}
        <div className="flex-1 flex justify-center items-center mt-10">
          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
            {governmentServices.map((service) => (
              <motion.div
                key={service.title}
                layout
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                className="relative rounded-2xl border bg-white text-left shadow-sm overflow-hidden group"
              >
                {service.imageUrl && (
                  <div className="relative mb-4 h-40 w-full overflow-hidden rounded-t-md">
                    <Image
                      src={service.imageUrl}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Description with overlay */}
                <div className="relative p-6 overflow-hidden rounded-b-2xl group">
                  {/* Overlay div */}
                  <div className="absolute inset-0 bg-[#131E3A] opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-b-2xl z-0"></div>

                  <div className="relative z-10 group-hover:text-white transition-colors duration-300">
                    <h3 className="text-xl font-semibold">{service.title}</h3>
                    <p 
                      className="mt-2 text-sm group-hover:text-white">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


     {/* SECTION 3: Features */}
      <section
        id="features"
        className="h-screen flex flex-col bg-white px-6 pt-32 pb-32"
      >
        {/* Section Title */}
        <h2 className="text-5xl font-bold text-center text-[#131E3A] mb-3">
          Features
        </h2>

        <p className="text-center text-muted-foreground max-w-2xl mx-auto">
          Explore the core capabilities that make BrgyGo efficient, user-friendly, and modern.
        </p>

        {/* Content Container */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid w-full max-w-4xl gap-8 rounded-2xl border bg-white p-12 shadow-sm md:grid-cols-3"
          >
            {[            
              {
                title: "Citizen Services",
                description:
                  "Apply for documents, track requests, and book appointments online.",
                icon: <Newspaper className="h-12 w-12 text-blue-600" />,
              },
              {
                title: "Operations Hub",
                description:
                  "Streamline approvals, records, payments, and community broadcasts.",
                icon: <Briefcase className="h-12 w-12 text-blue-600" />,
              },
              {
                title: "Supabase Ready",
                description:
                  "Built to integrate with Supabase for authentication, data storage, and automation.",
                icon: <Database className="h-12 w-12 text-blue-600" />,
              },
            ].map((feature) => (
              <div key={feature.title} className="space-y-4 text-center">
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>


     {/* SECTION 4: Announcements */}
      <section
        id="announcements"
        className="h-screen flex flex-col bg-slate-50 px-6 pt-32 pb-32"
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-5xl font-bold text-[#131E3A]">Latest Announcements</h2>
          <p className="text-muted-foreground">
            Stay updated with the latest news and announcements from your barangay.
          </p>
        </div>

        {/* Content (centered vertically) */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-5xl">
            {isLoading ? (
              <p className="text-center text-lg">Loading announcements...</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>


     {/* SECTION 5: About Us */}
      <section
        id="about"
        className="relative flex flex-col items-center bg-white px-6 pt-32 pb-32 overflow-hidden"
      >

        {/* RIGHT-SIDE SVG Animation (BEHIND CONTENT, ALIGNED WITH TEXT DESCRIPTION) */}
        <motion.div
          initial={{ opacity: 0, x: 120 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-100px" }}
          className="absolute right-0 top-[55%] -translate-y-1/2 w-[320px] opacity-80 pointer-events-none select-none z-0"
        >
          <img
            src="/kani blue.svg"
            alt="Community Animation"
            className="w-full h-auto"
          />
        </motion.div>

        {/* Heading */}
        <div className="w-full max-w-5xl text-center mb-12 relative z-10">
          <h2 className="text-5xl font-bold text-[#131E3A]">About Us</h2>
        </div>

        {/* Top Row: Logo + Text */}
        <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full relative z-10">

          {/* Logo with Circle Overlay */}
          <div className="relative flex-shrink-0 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
            <div className="absolute inset-0 bg-[#2E5090] rounded-full shadow-lg z-0"></div>
            <div className="relative w-full h-full z-10">
              <Image
                src="/Logo.svg"
                alt="Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Text Description */}
          <div className="flex-1 flex justify-center">
            <div className="max-w-xl text-gray-700 text-base sm:text-lg md:text-lg leading-relaxed text-justify">
              <p>
                <span className="font-semibold text-[#1976D2]">BrgyGo</span> is an official digital platform developed to support and enhance local governance within Cebu. It aims to modernize public service delivery through efficient, transparent, and citizen-centered digital solutions.
              </p>

              <p className="mt-4">
                The platform streamlines essential barangay processes, reduces paperwork, minimizes delays, and ensures that residents can access services in a faster and more convenient way.
              </p>
            </div>
          </div>

        </div>

        {/* Partnership Line Below Top Row */}
        <div className="mt-12 flex items-center gap-4 justify-center relative z-10">
          <p className="text-gray-700 font-medium text-center text-lg sm:text-xl">
            In Partnership With the Municipality of Cebu
          </p>
          <div className="relative w-24 h-24">
            <Image
              src="/cebu seal.png"
              alt="Cebu City Seal"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </section>




      

     {/* SECTION 5: Visit Us */}
      <section
        id="visit-us"
        className="h-screen flex flex-col bg-slate-50 px-6 pt-32 pb-32"
      >

        {/* Top Title Section */}
        <div className="text-center w-full max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-[#131E3A]">Visit Us</h2>
          <p className="text-muted-foreground mt-2">
            Come and visit us at Cebu City Hall — your local Barangay Office is ready to assist you.
          </p>
        </div>

        {/* Content Centering */}
        <div className="flex-1 flex items-center justify-center w-full mt-6">
          <div className="w-full max-w-4xl px-2">

            {/* Map */}
            <div className="w-full h-[450px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62712.40274251852!2d123.8316483!3d10.3156995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9993bb6d4a58f%3A0x9cf7c84a76b6d46f!2sCebu%20City%20Hall!5e0!3m2!1sen!2sph!4v1708300000000!5m2!1sen!2sph"
                allowFullScreen
                loading="lazy"
                className="w-full h-full rounded-2xl shadow-lg border border-gray-200"
              ></iframe>
            </div>

          </div>
        </div>
      </section>

    </main>
  );
}
