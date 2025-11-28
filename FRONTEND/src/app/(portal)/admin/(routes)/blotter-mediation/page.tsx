import { PageHeader } from "@/components/layouts/page-header";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Blotter & Mediation"
        description="Record incidents, mediation sessions, and outcomes."
      />
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-slate-50 via-white to-blue-50 px-8 py-16 text-center shadow-sm">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#e0edff,transparent_45%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#e8f4ff,transparent_45%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-xl space-y-4">
          <div className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
            Coming soon
          </div>
          <h2 className="text-2xl font-semibold text-foreground">
            Blotter & Mediation workspace
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Intake incident reports, assign mediators, schedule hearings, and
            track outcomes in one view. This module is being prepared—check back
            soon.
          </p>
          <div className="flex items-center justify-center gap-3 pt-3">
            <Button variant="outline" size="sm" asChild>
              <a href="/admin/overview">Back to overview</a>
            </Button>
            <Button variant="secondary" size="sm" disabled>
              Notify me
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
