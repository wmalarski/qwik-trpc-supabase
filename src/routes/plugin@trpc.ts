import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { serverTrpc$ } from "~/lib/qwik-trpc";
import { createContext } from "~/server/trpc/context";
import { appRouter, type AppRouter } from "~/server/trpc/router";
import { getBaseUrl } from "~/utils/getBaseUrl";

export const { actionTrpc, onRequest, clientTrpc } = serverTrpc$<AppRouter>(
  (event) => ({
    appRouter,
    createContext: () => createContext(event),
  }),
  {
    client: {
      links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
      transformer: superjson,
    },
    prefix: "/api/trpc",
  },
);
