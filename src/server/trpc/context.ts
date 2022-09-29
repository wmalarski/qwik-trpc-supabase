import { RequestEvent } from "@builder.io/qwik-city";
import { Session } from "@supabase/supabase-js";
import * as trpc from "@trpc/server";
import { prisma } from "../db/client";
import { getUserByRequest, supabase } from "../supabase";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
    session: opts.session,
    supabase,
  };
};

export const createContext = async (ev: RequestEvent) => {
  await getUserByRequest(ev.request);

  // const { req, res } = opts;

  // Get the session from the server using the unstable_getServerSession wrapper function
  // const session = await getServerAuthSession({ req, res });

  // supabase.auth.api

  return await createContextInner({
    session: null,
  });
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
