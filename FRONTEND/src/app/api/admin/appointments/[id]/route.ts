import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const { id } = params;

  try {
    const body = await request.json();
    const { status, notes, schedule_at } = body;

    if (!status && !notes && !schedule_at) {
      return NextResponse.json(
        { error: "Nothing to update. Provide status, notes, or schedule_at." },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch current row for audit
    const { data: current, error: currentError } = await supabase
      .from("appointments")
      .select("status, user_id")
      .eq("id", id)
      .single();

    if (currentError) {
      console.error("Error loading appointment for audit:", currentError);
      return NextResponse.json({ error: currentError.message }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("appointments")
      .update({ status, notes, schedule_at })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating appointment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optional audit trail
    if (status && current?.status && status !== current.status) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error: auditError } = await supabase.from("appointment_status_history").insert([
        {
          appointment_id: id,
          old_status: current.status,
          new_status: status,
          changed_by: user?.id ?? null,
        },
      ]);
      if (auditError) {
        console.error("Error writing audit entry:", auditError);
        return NextResponse.json({ error: auditError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error updating appointment:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
