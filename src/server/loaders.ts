import type { loader$ } from "@builder.io/qwik-city";
import { prisma } from "~/server/db/client";
import { appRouter } from "~/server/trpc/router";
import { getUserByCookie, supabase } from "./auth/auth";

type LoaderParameter = Parameters<typeof loader$>[0];
type RequestEventLoader = Parameters<LoaderParameter>[0];

export const getUserFromEvent = async (event: RequestEventLoader) => {
  const promise = event.sharedMap.get("user") || getUserByCookie(event.cookie);
  event.sharedMap.set("user", promise);
  const result = await promise;
  return result;
};

export const getTrpcFromEvent = async (
  event: RequestEventLoader
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
