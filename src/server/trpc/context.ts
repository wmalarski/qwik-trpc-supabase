import type { RequestEventCommon } from "@builder.io/qwik-city";
import type * as trpc from "@trpc/server";
import { getSupabaseInstance } from "~/routes/plugin@supabase";
import { getUserByCookie } from "../auth/auth";
import { prisma } from "../db/client";

export const createContext = async (event: RequestEventCommon) => {
  const supabase = getSupabaseInstance(event);
  const user = await getUserByCookie(event);

  return { prisma, supabase, user };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
