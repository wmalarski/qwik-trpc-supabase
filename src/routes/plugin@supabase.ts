import { z } from "@builder.io/qwik-city";
import { serverSupabase$ } from "~/lib/qwik-supabase";
import { getBaseUrl } from "~/utils/getBaseUrl";

export const {
  getSupabaseInstance,
  getSupabaseSession,
  onRequest,
  useSupabaseSignInWithOAuth,
  useSupabaseSignInWithOtp,
  useSupabaseSignInWithPassword,
  useSupabaseSignOut,
  useSupabaseSignUp,
} = serverSupabase$(async (event) => {
  const parsed = await z
    .object({ supabaseKey: z.string(), supabaseUrl: z.string() })
    .parseAsync({
      supabaseKey: event.env.get("PUBLIC_SUPABASE_ANON_KEY"),
      supabaseUrl: event.env.get("PUBLIC_SUPABASE_URL"),
    });

  return {
    emailRedirectTo: `${getBaseUrl()}/auth/callback`,
    signInPath: "/auth/signIn",
    signInRedirectTo: "/",
    supabaseKey: parsed.supabaseKey,
    supabaseUrl: parsed.supabaseUrl,
  };
});
