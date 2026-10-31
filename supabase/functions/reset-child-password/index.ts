import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ResetPasswordRequest {
  childId: string;
  newPassword: string;
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the authorization header to identify the parent
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Create a client with the user's token to verify their identity
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get the current user (parent)
    const { data: { user: parent }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !parent) {
      throw new Error("Unauthorized");
    }

    const { childId, newPassword }: ResetPasswordRequest = await req.json();

    if (!childId || !newPassword) {
      throw new Error("Missing required fields");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    // Verify the parent has admin role
    const { data: roleData, error: roleError } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", parent.id)
      .single();

    if (roleError || roleData?.role !== "admin") {
      throw new Error("Only admins can reset child passwords");
    }

    // Verify the parent-child relationship exists
    const { data: relationship, error: relError } = await supabaseClient
      .from("parent_child_relationships")
      .select("id")
      .eq("parent_id", parent.id)
      .eq("child_id", childId)
      .single();

    if (relError || !relationship) {
      throw new Error("You are not authorized to reset this child's password");
    }

    // Use admin client to update the child's password
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      childId,
      { password: newPassword }
    );

    if (updateError) {
      throw new Error(`Failed to reset password: ${updateError.message}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Password reset successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in reset-child-password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
