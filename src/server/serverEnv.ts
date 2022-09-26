import { z } from "zod";

const schema = z.object({
  PUBLIC_SUPABASE_URL: z.string().url(),
  PUBLIC_SUPABASE_ANON_KEY: z.string(),
  PUBLIC_REDIRECT_URL: z.string().url(),
});

export const serverEnv = schema.parse(process.env);
