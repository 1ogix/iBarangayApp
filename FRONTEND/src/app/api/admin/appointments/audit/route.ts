import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("appointment_status_history")
      .select(
        `
        id,
        appointment_id,
        old_status,
        new_status,
        changed_by,
        changed_at,
        notes,
        appointments:appointment_id ( contact, user_id )
      `
      )
      .order("changed_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error fetching audit trail:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error fetching audit trail:", error);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
