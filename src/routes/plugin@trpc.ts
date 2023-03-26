import { serverTrpc$ } from "~/lib/qwik-trpc3";

export const trpcPlugin = serverTrpc$(async (event) => {
  const { getTrpcFromEvent } = await import("~/server/loaders");
  return getTrpcFromEvent(event);
});
