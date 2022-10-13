import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { serverEnv } from "~/server/serverEnv";
import { t } from "../trpc";

export const authRouter = t.router({
  sendMagicLink: t.procedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.supabase.auth.admin.inviteUserByEmail(
        input.email,
        { redirectTo: serverEnv.VITE_REDIRECT_URL }
      );

      if (result.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error.message,
        });
      }

      return result.data;
    }),
  signUp: t.procedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const result = await ctx.supabase.auth.signUp({
        ...input,
        options: { emailRedirectTo: serverEnv.VITE_REDIRECT_URL },
      });

      if (result.error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: result.error.message,
        });
      }

      return;
    }),
});
