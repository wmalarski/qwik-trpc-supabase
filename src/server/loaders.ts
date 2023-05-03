import type { RequestEventCommon } from "@builder.io/qwik-city";
import { prisma } from "~/server/db/client";
import { appRouter } from "~/server/trpc/router";
import { getUserFromEvent } from "./auth/auth";
import { createSupabase } from "./auth/supabase";

export const getTrpcFromEvent = async (
  event: RequestEventCommon
): Promise<ReturnType<typeof appRouter.createCaller>> => {
  const cachedTrpc = event.sharedMap.get("trpc");
  if (cachedTrpc) {
    return cachedTrpc;
  }

  const user = await getUserFromEvent(event);

  const supabase = createSupabase(event);

  const trpc = appRouter.createCaller({
    prisma,
    supabase,
    user,
  });

  event.sharedMap.set("trpc", trpc);

  return trpc;
};
