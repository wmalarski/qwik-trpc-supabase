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

type TrpcCaller = ReturnType<typeof appRouter.createCaller>;

type TrpcCallerOptions = {
  prefix: string;
};

type TrpcConfig = {
  dotPath: string[];
};

type TrpcResolver = {
  config: TrpcConfig;
  callerQrl: QRL<(event: RequestEventCommon) => Promise<TrpcCaller>>;
};

export const trpcGlobalActionResolverQrl = (
  contextQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      const context = await contextQrl();
      const caller = await context.callerQrl(event);

      return context.config.dotPath.reduce(
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
  contextQrl: QRL<() => TrpcResolver>,
  config: TrpcConfig
) => {
  // eslint-disable-next-line qwik/loader-location
  return routeAction$(
    async (args, event) => {
      const context = await contextQrl();
      const caller = await context.callerQrl(event);

      return context.config.dotPath.reduce(
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

export const serverTrpcQrl = (
  callerQrl: QRL<(event: RequestEventCommon) => Promise<TrpcCaller>>,
  options: TrpcCallerOptions
) => {
  return {
    onRequest: async (event: RequestEvent) => {
      const prefixPath = `${options.prefix}/`;
      const pathname = event.url.pathname;
      if (
        isServer &&
        pathname.startsWith(prefixPath) &&
        event.method === "POST"
      ) {
        const [, trpcPath] = pathname.split(prefixPath);
        const dotPath = trpcPath.split(".");
        const args = await event.request.json();

        const caller = await callerQrl(event);

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
            const result = await fetch(`${options.prefix}/${path}`, {
              body: JSON.stringify(args),
              method: "POST",
            });
            return result.json();
          };
        },
        globalAction: () => {
          return trpcGlobalActionResolver$(
            () => ({ callerQrl, config }),
            config
          );
        },
        routeAction: () => {
          return trpcRouteActionResolver$(
            () => ({ callerQrl, config }),
            config
          );
        },
      };
    },
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
