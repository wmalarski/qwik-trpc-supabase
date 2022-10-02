import { createTRPCProxyClient, httpLink, loggerLink } from "@trpc/client";
import type { GetInferenceHelpers } from "@trpc/server";
import superjson from "superjson";
import type { AppRouter } from "~/server/trpc/router";

export type InferProcedures = GetInferenceHelpers<AppRouter>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferPromise<T> = T extends (...args: any) => Promise<infer A>
  ? A
  : never;

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    loggerLink({
      enabled: (opts) =>
        process.env.NODE_ENV === "development" ||
        (opts.direction === "down" && opts.result instanceof Error),
    }),
    httpLink({
      // TODO: Fix link
      url: "http://127.0.0.1:5173/api/trpc",
    }),
  ],
  transformer: superjson,
});
