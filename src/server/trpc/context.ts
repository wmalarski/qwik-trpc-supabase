import * as trpc from "@trpc/server";
import { Session } from "next-auth";
import { prisma } from "../db/client";

type CreateContextOptions = {
  session: Session | null;
};

export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

/**
 * This is the actual context you'll use in your router
 * @link https://trpc.io/docs/context
 **/
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

// /**
//  * Creates a tRPC router that asserts all queries and mutations are from an authorized user. Will throw an unauthorized error if a user is not signed in.
//  **/
// export function createProtectedRouter() {
//   return createRouter().middleware(({ ctx, next }) => {
//     if (!ctx.session || !ctx.session.user) {
//       throw new trpc.TRPCError({ code: "UNAUTHORIZED" });
//     }
//     return next({
//       ctx: {
//         ...ctx,
//         // infers that `session` is non-nullable to downstream resolvers
//         session: { ...ctx.session, user: ctx.session.user },
//       },
//     });
//   });
// }
