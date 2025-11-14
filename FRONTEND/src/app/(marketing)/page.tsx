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
      title: "Document Requests",
      imageUrl:
        "https://images.pexels.com/photos/7821517/pexels-photo-7821517.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "Easily request and track important documents online, reducing wait times and paperwork.",
    },
    {
      title: "Appointment Scheduling",
      imageUrl:
        "https://images.pexels.com/photos/4348401/pexels-photo-4348401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "Book appointments with barangay officials for various services at your convenience.",
    },
    {
      title: "Community Announcements",
      imageUrl:
        "https://images.pexels.com/photos/16038319/pexels-photo-16038319/free-photo-of-a-sign-for-the-barangay-hall-in-the-philippines.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "Stay informed with the latest news and updates from your barangay.",
    },
    {
      title: "Payment Processing",
      imageUrl:
        "https://images.pexels.com/photos/6994992/pexels-photo-6994992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      description:
        "Make secure payments for barangay services directly through the platform.",
    },
  ];

  return (
    // Use a main tag to wrap all sections for better semantics
    <main className="flex flex-col">
      {/* SECTION 1: Hero */}
      <section className="relative flex h-screen flex-col justify-center gap-8 bg-[url('/cebu_city_hall.jpg')] bg-cover bg-center px-5 py-20 pt-20 text-white md:px-20 md:py-24">
       
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
        className="flex flex-col justify-center items-center bg-slate-50 px-6 py-16"
      >
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-5xl  font-bold text-[#131E3A]">Government Services</h2>
            <p className="text-muted-foreground">
              Discover the comprehensive services BrgyGo offers to streamline
              barangay operations and enhance citizen engagement.
            </p>
          </div>
        </div>


       {/* Government services cards from static data */}
        <div className="grid mt-6 w-full max-w-4xl grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
          {governmentServices.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border bg-white text-left shadow-sm"
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
              <div className="p-6">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


     {/* SECTION 2: Features */}
      <section
        id="features"
        className="flex justify-center bg-white px-6 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid w-full max-w-4xl gap-6 rounded-2xl border bg-white p-8 text-left shadow-sm md:grid-cols-3"
        >
          {[
            {
              title: "Citizen Services",
              description:
                "Apply for documents, track requests, and book appointments online.",
              icon: <Newspaper className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Operations Hub",
              description:
                "Streamline approvals, records, payments, and community broadcasts.",
              icon: <Briefcase className="h-8 w-8 text-blue-600" />,
            },
            {
              title: "Supabase Ready",
              description:
                "Built to integrate with Supabase for auth, data, and automation.",
              icon: <Database className="h-8 w-8 text-blue-600" />,
            },
          ].map((feature) => (
            <div key={feature.title} className="space-y-2">
              {feature.icon}
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </motion.div>
      </section>


     {/* SECTION 3: Announcements */}
      <section
        id="announcements"
        className="flex justify-center bg-slate-50 px-6 py-16"
      >
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-[#131E3A]">Latest Announcements</h2>
            <p className="text-muted-foreground">
              Stay updated with the latest news and announcements from your
              barangay.
            </p>
          </div>
          {isLoading ? (
            <p className="text-center">Loading announcements...</p>
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
      </section>


     {/* SECTION 4: About Us */}
      <section
        id="about"
        className="flex flex-col items-center bg-white px-6 py-16 text-center"
      >
        <div className="w-full max-w-5xl space-y-8">
          <h2 className="text-5xl font-bold text-[#131E3A]">About Us</h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mt-8">
            {/* Image */}
            <div className="w-72 h-72 relative">
              <Image
                src="/cebu seal.png"
                alt="Cebu City Seal"
                fill
                className="object-contain"
              />
            </div>

            {/* Text */}
            <div className="max-w-2xl text-gray-700 leading-relaxed text-justify">
              <p>
                The Cebu City Hall stands as a proud symbol of governance and heritage
                in the heart of Cebu. Established in the early 20th century, it has
                served as the center of local administration, providing public
                services and preserving Cebu’s rich history. Today, through digital
                initiatives like <span className="font-semibold text-[#1976D2]">BrgyGo</span>, the city continues to bridge modern
                technology with civic engagement, empowering citizens and fostering
                transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      

     {/* SECTION 5: Visit Us */}
      <section
        id="visit-us"
        className="flex flex-col justify-center items-center bg-white px-6 py-20"
      >
        <div className="w-full max-w-4xl space-y-8 text-center">
          <h2 className="text-5xl font-bold text-[#131E3A]">Visit Us</h2>
          <p className="text-muted-foreground">
            Come and visit us at Cebu City Hall — your local Barangay Office is ready to assist you.
          </p>

          <div className="mt-8 flex justify-center">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62712.40274251852!2d123.8316483!3d10.3156995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9993bb6d4a58f%3A0x9cf7c84a76b6d46f!2sCebu%20City%20Hall!5e0!3m2!1sen!2sph!4v1708300000000!5m2!1sen!2sph"
              width="100%"
              height="450"
              allowFullScreen
              loading="lazy"
              className="rounded-2xl shadow-lg border border-gray-200"
              title="Cebu City Hall Location"
            ></iframe>
          </div>
        </div> 
      </section>

    </main>
  );
}
