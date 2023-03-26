/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  type RequestEvent,
  type RequestEventCommon,
} from "@builder.io/qwik-city";
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

export const trpcGlobalActionResolverQrl = (
  resolverQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
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
    { id: config.dotPath.join(".") }
  );
};

export const trpcGlobalActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcGlobalActionResolverQrl
);

export const trpcRouteActionResolverQrl = (
  resolverQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
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
    { id: config.dotPath.join(".") }
  );
};

export const trpcRouteActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcRouteActionResolverQrl
);

export const serverTrpcQrl = (factory: QRL<TrpcCallerFactory>) => {
  return {
    onRequest: async (event: RequestEvent) => {
      const prefix = "/api/trpc";
      const prefixPath = `${prefix}/`;
      const pathname = event.url.pathname;
      if (
        isServer &&
        pathname.startsWith(prefixPath) &&
        event.method === "POST"
      ) {
        const [, trpcPath] = pathname.split(prefixPath);
        const dotPath = trpcPath.split(".");
        const args = await event.request.json();

        const caller = await factory(event);

        const result = await dotPath.reduce(
          (prev, curr) => prev[curr],
          caller as any
        )(args);

        event.json(200, result);
      }
    },
    trpcPlugin: (config: TrpcConfig) => {
      return {
        fetch: () => {
          return async (args: any) => {
            const path = config.dotPath.join(".");
            const prefix = "/api/trpc";

            const result = await fetch(`${prefix}/${path}`, {
              body: JSON.stringify(args),
              method: "POST",
            });

            return result.json();
          };
        },
        globalAction: () =>
          trpcGlobalActionResolver$(() => ({ config, factory }), config),
        routeAction: () =>
          trpcRouteActionResolver$(() => ({ config, factory }), config),
      };
    },
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
