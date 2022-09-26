import * as trpc from "@trpc/server";
import { prisma } from "../db/client";
import { supabase } from "../supabase";

type CreateContextOptions = {
  session: null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    prisma,
    session: opts.session,
    supabase,
  };
};

export const createContext = async () =>
  // opts: trpcNext.CreateNextContextOptions,
  {
    // const { req, res } = opts;

    // Get the session from the server using the unstable_getServerSession wrapper function
    // const session = await getServerAuthSession({ req, res });

    return await createContextInner({
      session: null,
    });
  };

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
