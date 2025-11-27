import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("schedule_at", { ascending: true });

    if (error) {
      console.error("Error fetching appointments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error fetching appointments:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { user_id, type, reason, schedule_at, status = "Pending", contact, notes } = body;

    if (!user_id || !type || !reason || !schedule_at) {
      return NextResponse.json(
        { error: "user_id, type, reason, and schedule_at are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const contactValue = contact ?? "Not provided";

    const { data, error } = await supabase
      .from("appointments")
      .insert([
        {
          user_id,
          type,
          reason,
          schedule_at,
          status,
          contact: contactValue,
          notes,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating appointment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert initial audit entry
    if (data?.id) {
      const { error: auditError } = await supabase.from("appointment_status_history").insert([
        {
          appointment_id: data.id,
          old_status: null,
          new_status: data.status,
          changed_by: data.user_id,
          notes: "Appointment created",
        },
      ]);
      if (auditError) {
        console.error("Error creating audit entry:", auditError);
        return NextResponse.json({ error: auditError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error creating appointment:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
