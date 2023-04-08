import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  console.log("protectedProcedure", ctx);

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});
