/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  routeLoader$,
  type RequestEvent,
  type RequestEventCommon,
  type RequestEventLoader,
} from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import type { AnyRouter, TRPCError } from "@trpc/server";

type TrpcRouteLoaderConfig = {
  path: string[];
  args: any;
};

type TrpcCaller<TRouter extends AnyRouter> = ReturnType<
  TRouter["createCaller"]
>;

type TrpcCallerOptions = {
  prefix: string;
};

export const trpcResolver = async <TRouter extends AnyRouter>(
  caller: TrpcCaller<TRouter>,
  dotPath: string[],
  args: any
) => {
  const fnc = dotPath.reduce((prev, curr) => prev[curr], caller as any);

  const safeParse = (data: string) => {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  };

  try {
    const result = await fnc(args);

    return { result, status: "success" };
  } catch (err) {
    const trpcError = err as TRPCError;
    const error = {
      code: trpcError.code,
      issues: safeParse(trpcError.message),
      status: "error",
    };
    return error;
  }
};

export const serverTrpcQrl = <TRouter extends AnyRouter>(
  callerQrl: QRL<(event: RequestEventCommon) => Promise<TrpcCaller<TRouter>>>,
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
        const result = await trpcResolver(caller, dotPath, args);

        event.json(200, result);
      }
    },
    trpcFetch: (getPath: () => string[]) => {
      return async (args: any) => {
        const path = getPath().join(".");
        const response = await fetch(`${options.prefix}/${path}`, {
          body: JSON.stringify(args),
          method: "POST",
        });
        return response.json();
      };
    },
    trpcGlobalAction: (getPath: () => string[]) => {
      const path = getPath();
      // eslint-disable-next-line qwik/loader-location
      return globalAction$(
        async (args, event) => {
          const caller = await callerQrl(event);
          return trpcResolver(caller, path, args);
        },
        { id: path.join(".") }
      );
    },
    trpcRouteAction: (getPath: () => string[]) => {
      const path = getPath();
      // eslint-disable-next-line qwik/loader-location
      return routeAction$(
        async (args, event) => {
          const caller = await callerQrl(event);
          return trpcResolver(caller, path, args);
        },
        { id: path.join(".") }
      );
      //
    },
    trpcRouteLoaderQrl: (
      configQrl: QRL<(event: RequestEventLoader) => TrpcRouteLoaderConfig>
    ) => {
      // eslint-disable-next-line qwik/loader-location
      return routeLoader$(async (event) => {
        const config = await configQrl(event);
        const caller = await callerQrl(event);
        return trpcResolver(caller, config.path, config.args);
      });
    },
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
