import { RequestEventCommon } from "@builder.io/qwik-city";
import { User } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import { getUserByCookie, supabase } from "../auth/auth";
import { prisma } from "../db/client";

type CreateContextOptions = {
  user?: User | null;
};

export const createContextInner = (opts: CreateContextOptions) => {
  return { prisma, supabase, user: opts.user };
};

export const createContext = async (event: RequestEventCommon) => {
  const user = await getUserByCookie(event);

  return createContextInner({ user });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
