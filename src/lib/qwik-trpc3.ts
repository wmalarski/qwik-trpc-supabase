/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  type RequestEventCommon,
} from "@builder.io/qwik-city";
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

export const trpcGlobalActionResolverQrl = (
  resolverQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
  const id = config.dotPath.join(".");

  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      const resolver = await resolverQrl();
      const caller = await resolver.factory(event);

      return resolver.config.dotPath.reduce(
        (prev, curr) => prev[curr],
        caller as any
      )(args);
    },
    { id }
  );
};

export const trpcGlobalActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcGlobalActionResolverQrl
);

export const trpcRouteActionResolverQrl = (
  resolverQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
  const id = config.dotPath.join(".");

  // eslint-disable-next-line qwik/loader-location
  return routeAction$(
    async (args, event) => {
      const resolver = await resolverQrl();
      const caller = await resolver.factory(event);

      return resolver.config.dotPath.reduce(
        (prev, curr) => prev[curr],
        caller as any
      )(args);
    },
    { id }
  );
};

export const trpcRouteActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcRouteActionResolverQrl
);

export const serverTrpcQrl = (factory: QRL<TrpcCallerFactory>) => {
  return (config: TrpcConfig) => {
    return {
      globalAction: () =>
        trpcGlobalActionResolver$(() => ({ config, factory }), config),
    };
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
