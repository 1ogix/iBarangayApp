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
  const [localNews, setLocalNews] = useState<Announcement[]>([]);
  const [barangayAnnouncements, setBarangayAnnouncements] = useState<Announcement[]>([]); 
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
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching announcements:", error);
    } else if (data) {
      const formattedData = data.map((item) => ({
        ...item,
        imageUrl: item.image_url ?? "",
        date: formatSupabaseDate(item.created_at),
      }));

      // Split into Local News and Barangay Announcements
      setLocalNews(formattedData.filter((item) => item.category === "news"));
      setBarangayAnnouncements(formattedData.filter((item) => item.category === "announcement"));
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
            <span className="text-[#89CFF0]">Go</span>
            : Your Digital Gateway to Barangay Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg font-thin text-white font-sans tracking-wide leading-relaxed drop-shadow-md"
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
          <Button
            asChild
            className="bg-[#131E3A] text-white text-lg font-semibold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:bg-white hover:text-[#131E3A] border-2 border-[#131E3A]"
          >
            <Link href="/signup">Get Started</Link>
          </Button>

          
          <Button
              asChild
              className="bg-[#1976D2]/10 text-white text-lg font-semibold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:bg-white hover:text-[#131E3A] border-2 border-white"
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
            <h2 className="text-6xl font-sans font-bold">GOVERMENT SERVICES</h2>
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
        <div className="w-full max-w-5xl space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#131E3A]">Announcements</h2>
            <p className="text-muted-foreground">
              Stay informed with the latest barangay updates and local happenings.
            </p>
          </div>

          {/* LOCAL NEWS SECTION */}
          <section
            id="local-news"
            className="flex justify-center bg-[#f8f9fb] px-6 py-16"
          >
            <div className="w-full max-w-6xl">
              <div className="bg-white rounded-3xl shadow-md p-10">
                {/* Section Header */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-[#1976D2] flex items-center gap-2">
                    <Newspaper className="w-7 h-7 text-[#1976D2]" />
                    Local News
                  </h2>
                  <Button
                    asChild
                    className="bg-[#1976D2] text-white px-5 py-2 rounded-lg shadow-md hover:bg-[#1565C0] transition-all duration-300"
                  >
                    <Link href="/local-news">Read More →</Link>
                  </Button>
                </div>

                {/* News Cards */}
                {isLoading ? (
                  <p className="text-center text-gray-500">Loading local news...</p>
                ) : localNews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {localNews.slice(0, 4).map((news) => (
                      <div
                        key={news.id}
                        className="flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
                      >
                        {news.imageUrl && (
                          <div className="relative h-40 w-full">
                            <Image
                              src={news.imageUrl}
                              alt={news.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        <div className="p-4 flex flex-col flex-grow">
                          <h3 className="text-base font-semibold mb-1 text-[#131E3A] line-clamp-2">
                            {news.title}
                          </h3>
                          <p className="text-sm text-gray-600 flex-grow line-clamp-3">
                            {news.content}
                          </p>
                          <Link
                            href={`/local-news/${news.id}`}
                            className="text-[#1976D2] text-sm font-semibold mt-3 hover:underline"
                          >
                            Read More →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">No local news available.</p>
                )}
              </div>
            </div>
          </section>



          {/* BARANGAY ANNOUNCEMENTS */}
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-[#1976D2] flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-[#1976D2]" /> Barangay Announcements
            </h3>
            {isLoading ? (
              <p className="text-center">Loading announcements...</p>
            ) : barangayAnnouncements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {barangayAnnouncements.map((a) => (
                  <AnnouncementCard key={a.id} announcement={a} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No announcements available.</p>
            )}
          </div>
        </div>
      </section>

    </main>
  );
}
