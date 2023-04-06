import type { RequestEventCommon } from "@builder.io/qwik-city";
import type { User } from "@supabase/supabase-js";
import type * as trpc from "@trpc/server";
import { createSupabase, getUserByCookie } from "../auth/auth";
import { prisma } from "../db/client";

type CreateContextOptions = {
  user?: User | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  const supabase = createSupabase();
  return { prisma, supabase, user: opts.user };
};

export const createContext = async (event: RequestEventCommon) => {
  const user = await getUserByCookie(event);

  return createContextInner({ user });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
