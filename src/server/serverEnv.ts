import { z } from "zod";

const schema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string(),
  VITE_REDIRECT_URL: z.string().url(),
});

export const serverEnv = schema.parse(import.meta.env);
