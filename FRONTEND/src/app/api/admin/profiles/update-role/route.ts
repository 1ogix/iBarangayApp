import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { id, role } = await request.json();

    if (!id || !role) {
      return NextResponse.json(
        { error: "Both id and role are required." },
        { status: 400 }
      );
    }

    const allowedRoles = ["admin", "staff", "user"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role provided." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase URL or service role key.");
      return NextResponse.json(
        { error: "Server is missing Supabase configuration." },
        { status: 500 }
      );
    }

    // Use a service-role client without user session cookies so RLS does not block cross-user updates.
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select("id, role")
      .maybeSingle();

    if (error) {
      console.error("Error updating profile role:", error);
      return NextResponse.json(
        { error: "Failed to update profile role." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Profile not found or not updated." },
        { status: 404 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Unhandled error updating profile role:", error);
    return NextResponse.json(
      { error: "Unexpected error while updating role." },
      { status: 500 }
    );
  }
}
