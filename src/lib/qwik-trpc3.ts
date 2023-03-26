/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { implicit$FirstArg, type QRL } from "@builder.io/qwik";
import { globalAction$, type RequestEventCommon } from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import type { appRouter } from "~/server/trpc/router";

type TrpcCallerFactory = (
  event: RequestEventCommon
) => Promise<ReturnType<typeof appRouter.createCaller>>;

type TrpcConfig = {
  dotPath: string[];
};

type TrpcResolver = {
  config: TrpcConfig;
  factory: QRL<TrpcCallerFactory>;
};

export const trpcResolverQrl = (
  resolverQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
  if (!isServer) {
    console.log("NOT SERVER - trpcResolverQrl");
  }

  console.log("trpcResolverQrl-1", config);
  const id = config.dotPath.join(".");
  console.log("trpcResolverQrl-2", id);

  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      if (!isServer) {
        console.log("NOT SERVER - globalAction");
      }

      console.log("ARGS", args);

      const resolver = await resolverQrl();

      console.log("RESOLVER", resolver);

      const caller = await resolver.factory(event);

      const fnc = resolver.config.dotPath.reduce(
        (prev, curr) => prev[curr],
        caller as any
      );

      const result = await fnc(args);

      console.log("RESULT", result);

      return result;
    },
    { id }
  );
  //
};

export const trpcResolver$ = /*#__PURE__*/ implicit$FirstArg(trpcResolverQrl);

export const serverTrpcQrl = (factory: QRL<TrpcCallerFactory>) => {
  if (!isServer) {
    console.log("NOT SERVER - serverTrpcQrl");
  }

  return (config: TrpcConfig) => {
    if (!isServer) {
      console.log("NOT SERVER - config");
    }

    return trpcResolver$(() => ({ config, factory }), config);
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
