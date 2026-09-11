import { NextResponse } from "next/server";

import { createServerClient } from "@drape/lib/supabase/server";

export async function POST() {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
