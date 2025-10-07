import { createClient } from "./server";

export async function getSession() {
  const supabase = createClient();
  const {
    data: { session }
  } = await supabase.auth.getSession();
  return session;
}
