import { z } from "zod";

const schema = z.object({
  GOOGLE_ID: z.string(),
  GOOGLE_SECRET: z.string(),
  NEXTAUTH_SECRET: z.string(),
});

export const serverEnv = schema.parse(process.env);
