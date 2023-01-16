import type { SupabaseClient, User } from "@supabase/supabase-js";
import { prisma } from "~/server/db/client";
import { appRouter } from "~/server/trpc/router";
import type { RequestEventLoader } from "~/utils/endpointBuilder";

type RequestEventWithSession = RequestEventLoader & {
  user: User | null;
  supabase: SupabaseClient;
};

export const withTrpc = <
  R extends RequestEventWithSession = RequestEventWithSession
>() => {
  return (event: R) => {
    const trpc = appRouter.createCaller({
      prisma,
      supabase: event.supabase,
      user: event.user,
    });
    return { ...event, trpc };
  };
};
