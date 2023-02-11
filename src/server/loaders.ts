import type { User } from "@supabase/supabase-js";
import { prisma } from "~/server/db/client";
import { appRouter } from "~/server/trpc/router";
import { getUserByCookie, supabase } from "./auth/auth";
import type { ServerEvent } from "./types";

export const getUserFromEvent = (event: ServerEvent): Promise<User | null> => {
  const cachedPromise = event.sharedMap.get("user");
  if (cachedPromise) {
    return cachedPromise;
  }

  const promise = getUserByCookie(event);
  event.sharedMap.set("user", promise);
  return promise;
};

export const getTrpcFromEvent = async (
  event: ServerEvent
): Promise<ReturnType<typeof appRouter.createCaller>> => {
  const cachedTrpc = event.sharedMap.get("trpc");
  if (cachedTrpc) {
    return cachedTrpc;
  }

  const user = await getUserFromEvent(event);

  const trpc = appRouter.createCaller({
    prisma,
    supabase: supabase,
    user,
  });

  event.sharedMap.set("trpc", trpc);

  return trpc;
};
