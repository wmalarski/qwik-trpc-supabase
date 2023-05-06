import type { RequestEventCommon } from "@builder.io/qwik-city";
import { appRouter } from "~/server/trpc/router";
import { createContext } from "./context";

export const getTrpcFromEvent = async (
  event: RequestEventCommon
): Promise<ReturnType<typeof appRouter.createCaller>> => {
  const cachedTrpc = event.sharedMap.get("trpc");
  if (cachedTrpc) {
    return cachedTrpc;
  }

  const context = await createContext(event);
  const trpc = appRouter.createCaller(context);

  event.sharedMap.set("trpc", trpc);

  return trpc;
};
