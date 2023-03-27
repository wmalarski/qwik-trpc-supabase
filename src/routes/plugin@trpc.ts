import { implicit$FirstArg } from "@builder.io/qwik";
import { serverTrpc$ } from "~/lib/qwik-trpc2";
import type { AppRouter } from "~/server/trpc/router";

export const {
  trpcFetch,
  trpcGlobalAction,
  trpcRouteAction,
  trpcRouteLoaderQrl,
  onRequest,
} = serverTrpc$<AppRouter>(
  async (event) => {
    const { getTrpcFromEvent } = await import("~/server/loaders");
    return getTrpcFromEvent(event);
  },
  {
    prefix: "/api/trpc",
  }
);

export const trpcRouteLoader$ =
  /*#__PURE__*/ implicit$FirstArg(trpcRouteLoaderQrl);
