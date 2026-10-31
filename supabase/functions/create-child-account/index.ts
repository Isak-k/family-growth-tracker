import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

async function findUserIdByEmail(admin: any, email: string): Promise<string | null> {
  const { data: profile } = await admin
    .from("profiles").select("user_id").ilike("email", email).maybeSingle();
  if (profile?.user_id) return profile.user_id;
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error || !data?.users?.length) break;
    const u = data.users.find((x: any) => x.email?.toLowerCase() === email);
    if (u) return u.id;
    if (data.users.length < 200) break;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Please sign in first." }, 401);

    const userClient = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user: parent } } = await userClient.auth.getUser();
    if (!parent) return json({ error: "Please sign in first." }, 401);

    const { data: role } = await admin
      .from("user_roles").select("role").eq("user_id", parent.id).maybeSingle();
    if (role?.role !== "admin") return json({ error: "Only parents can create child accounts." });

    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const fullName = String(body.fullName ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255)
      return json({ error: "Please enter a valid email address." });
    if (password.length < 6) return json({ error: "Password must be at least 6 characters." });
    if (!fullName || fullName.length > 120) return json({ error: "Please enter the child's name." });
    if (email === parent.email?.toLowerCase())
      return json({ error: "You can't use your own email for your child." });

    let childId: string;
    let existed = false;

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email, password, email_confirm: true,
      user_metadata: { role: "student", full_name: fullName },
    });

    if (createErr) {
      if (!/already.*registered|already exists/i.test(createErr.message)) throw createErr;
      const existingId = await findUserIdByEmail(admin, email);
      if (!existingId) return json({ error: "This email is already in use." });

      const { data: links } = await admin
        .from("parent_child_relationships").select("parent_id").eq("child_id", existingId);
      if (links?.some((l: any) => l.parent_id === parent.id))
        return json({ error: "This child is already linked to your family." });
      if (links && links.length > 0)
        return json({ error: "This email belongs to another family. Please use a different email." });

      const { data: existingRole } = await admin
        .from("user_roles").select("role").eq("user_id", existingId).maybeSingle();
      if (existingRole?.role === "admin")
        return json({ error: "This email belongs to a parent account. Please use a different email." });

      // Unlinked student account (e.g. left over from an earlier failed attempt): reclaim it
      await admin.auth.admin.updateUserById(existingId, {
        password, email_confirm: true,
        user_metadata: { role: "student", full_name: fullName },
      });
      childId = existingId;
      existed = true;
    } else {
      childId = created.user!.id;
    }

    const { error: linkErr } = await admin
      .from("parent_child_relationships").insert({ parent_id: parent.id, child_id: childId });
    if (linkErr) throw linkErr;

    return json({ success: true, childId, existed });
  } catch (e: any) {
    console.error("create-child-account error:", e);
    return json({ error: e?.message ?? "Unexpected error" }, 500);
  }
});
