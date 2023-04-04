import { serverTrpc$ } from "~/lib/qwik-trpc";
import type { AppRouter } from "~/server/trpc/router";

export const { trpc, onRequest } = serverTrpc$<AppRouter>(
  async (event) => {
    const { getTrpcFromEvent } = await import("~/server/loaders");
    return getTrpcFromEvent(event);
  },
  {
    prefix: "/api/trpc",
  }
);
