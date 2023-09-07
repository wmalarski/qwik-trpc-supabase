import type { RequestEventCommon } from "@builder.io/qwik-city";
import type * as trpc from "@trpc/server";
import {
  getSupabaseInstance,
  getSupabaseSession,
} from "~/routes/plugin@supabase";
import { prisma } from "../db/client";

export const createContext = (event: RequestEventCommon) => {
  const supabase = getSupabaseInstance(event);
  const session = getSupabaseSession(event);

  return { prisma, supabase, user: session?.user };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
