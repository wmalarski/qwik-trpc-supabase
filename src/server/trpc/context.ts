import { RequestEvent } from "@builder.io/qwik-city";
import { User } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import { prisma } from "../db/client";
import { getUserByRequest, supabase } from "../supabase";

type CreateContextOptions = {
  user: User | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return { prisma, user: opts.user, supabase };
};

export const createContext = async (ev: RequestEvent) => {
  const user = await getUserByRequest(ev.request);

  return await createContextInner({ user });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
