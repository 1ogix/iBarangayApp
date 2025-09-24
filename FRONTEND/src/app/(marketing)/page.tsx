import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center gap-8 bg-gradient-to-b from-blue-50 to-white px-6 py-24 text-center">
      <div className="max-w-2xl space-y-4">
        <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-blue-600">
          BrgyGo
        </span>
        <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">
          Digitize services for a smarter barangay community.
        </h1>
        <p className="text-lg text-muted-foreground">
          Manage citizen requests, appointments, announcements, and operations in one secure platform. Empower staff with the right tools while giving residents a delightful digital experience.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/login">Access Portal</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="#features">Explore Features</Link>
        </Button>
      </div>
      <div id="features" className="grid max-w-4xl gap-6 rounded-2xl border bg-white p-8 text-left shadow-sm md:grid-cols-3">
        {[
          {
            title: "Citizen Services",
            description: "Apply for documents, track requests, and book appointments online."
          },
          {
            title: "Operations Hub",
            description: "Streamline approvals, records, payments, and community broadcasts."
          },
          {
            title: "Supabase Ready",
            description: "Built to integrate with Supabase for auth, data, and automation."
          }
        ].map((feature) => (
          <div key={feature.title} className="space-y-2">
            <h3 className="text-xl font-semibold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
