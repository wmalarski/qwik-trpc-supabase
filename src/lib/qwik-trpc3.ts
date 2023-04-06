/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  type Action,
  type RequestEvent,
  type RequestEventCommon,
  type RequestEventLoader,
} from "@builder.io/qwik-city";
import { isServer } from "@builder.io/qwik/build";
import {
  createTRPCProxyClient,
  type CreateTRPCClientOptions,
  type HTTPHeaders,
} from "@trpc/client";
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterContext,
  ProcedureRouterRecord,
  TRPCError,
} from "@trpc/server";
import type { ZodIssue } from "zod";

type ProxyCallbackOptions = {
  path: string[];
  args: unknown[];
};

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

type TrpcProcedureOutput<TProcedure extends AnyProcedure> =
  | {
      result: inferProcedureOutput<TProcedure>;
      status: "success";
    }
  | {
      code: ZodIssue["code"];
      status: "error";
      issues: ZodIssue[];
    };

type DecorateProcedure<TProcedure extends AnyProcedure> =
  TProcedure extends AnyQueryProcedure
    ? {
        loader: (
          event: RequestEventLoader,
          input: inferProcedureInput<TProcedure>
        ) => TrpcProcedureOutput<TProcedure>;
        query: (
          input: inferProcedureInput<TProcedure>
        ) => Promise<TrpcProcedureOutput<TProcedure>>;
      }
    : TProcedure extends AnyMutationProcedure
    ? {
        globalAction$: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          false
        >;
        routeAction$: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          false
        >;
        mutate: (
          input: inferProcedureInput<TProcedure>
        ) => Promise<TrpcProcedureOutput<TProcedure>>;
      }
    : never;

type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"]>
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
};

type ServerTrpcConfig<TRouter extends AnyRouter> = {
  appRouter: TRouter;
  createContext: () => Promise<inferRouterContext<TRouter>>;
};

type TrpcResolverArgs<TRouter extends AnyRouter> = {
  appRouter: TRouter;
  args: any;
  createContext: () => Promise<inferRouterContext<TRouter>>;
  dotPath: string[];
};

export const trpcResolver = async <TRouter extends AnyRouter>({
  dotPath,
  appRouter,
  createContext,
  args,
}: TrpcResolverArgs<TRouter>) => {
  const context = createContext();
  const caller = appRouter.createCaller(context);

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

type TrpcResolver<TRouter extends AnyRouter> = {
  dotPath: string[];
  configQrl: QRL<
    (event: RequestEventCommon) => Promise<ServerTrpcConfig<TRouter>>
  >;
};

export const trpcGlobalActionResolverQrl = <TRouter extends AnyRouter>(
  contextQrl: QRL<() => TrpcResolver<TRouter>>,
  dotPath: string[]
) => {
  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      const context = await contextQrl();
      const { appRouter, createContext } = await context.configQrl(event);
      return trpcResolver({ appRouter, args, createContext, dotPath });
    },
    { id: dotPath.join(".") }
  );
};

export const trpcGlobalActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcGlobalActionResolverQrl
);

export const trpcRouteActionResolverQrl = <TRouter extends AnyRouter>(
  contextQrl: QRL<() => TrpcResolver<TRouter>>,
  dotPath: string[]
) => {
  // eslint-disable-next-line qwik/loader-location
  return routeAction$(
    async (args, event) => {
      const context = await contextQrl();
      const { appRouter, createContext } = await context.configQrl(event);
      return trpcResolver({ appRouter, args, createContext, dotPath });
    },
    { id: dotPath.join(".") }
  );
};

export const trpcRouteActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcRouteActionResolverQrl
);

type TrpcCallerOptions<TRouter extends AnyRouter> = {
  prefix: string;
  client: CreateTRPCClientOptions<TRouter>;
};

export const serverTrpcQrl = <TRouter extends AnyRouter>(
  configQrl: QRL<
    (event: RequestEventCommon) => Promise<ServerTrpcConfig<TRouter>>
  >,
  options: TrpcCallerOptions<TRouter>
) => {
  const createRecursiveProxy = (callback: ProxyCallback, path: string[]) => {
    const proxy: unknown = new Proxy(() => void 0, {
      apply(_1, _2, args) {
        return callback({ args, path });
      },
      get(_obj, key) {
        if (typeof key !== "string") {
          return undefined;
        }
        return createRecursiveProxy(callback, [...path, key]);
      },
    });

    return proxy;
  };

  const client = createTRPCProxyClient<TRouter>(options.client);

  return {
    client,
    onRequest: async (event: RequestEvent) => {
      const prefixPath = `${options.prefix}/`;
      const pathname = event.url.pathname;
      if (!pathname.startsWith(prefixPath) || !isServer) {
        return;
      }

      const { resolveHTTPResponse } = await import("@trpc/server/http");

      const { createContext, appRouter } = await configQrl(event);

      try {
        const httpResponse = await resolveHTTPResponse({
          createContext,
          path: event.params.trpc,
          req: {
            body: await event.request.text(),
            headers: event.request.headers as unknown as HTTPHeaders,
            method: event.request.method,
            query: new URL(event.request.url).searchParams,
          },
          router: appRouter,
        });
        event.json(httpResponse.status, JSON.parse(httpResponse.body || "{}"));
        return;
      } catch (error: any) {
        event.error(500, "Internal Server Error");
        return;
      }
    },
    trpc: createRecursiveProxy((opts) => {
      const dotPath = opts.path.slice(0, -1);
      const action = opts.path[opts.path.length - 1];

      switch (action) {
        case "query": {
          const args = opts.args[0];
          const path = dotPath.join(".");

          const task = async () => {
            const response = await fetch(`${options.prefix}/${path}`, {
              body: JSON.stringify(args),
              method: "POST",
            });
            return response.json();
          };
          return task();
        }
        case "mutate": {
          const args = opts.args[0];
          const path = dotPath.join(".");

          const task = async () => {
            const response = await fetch(`${options.prefix}/${path}`, {
              body: JSON.stringify(args),
              method: "POST",
            });
            return response.json();
          };
          return task();
        }
        case "globalAction$": {
          return trpcGlobalActionResolver$(
            () => ({ configQrl, dotPath }),
            dotPath
          );
        }
        case "loader": {
          const event = opts.args[0] as RequestEventLoader;
          const args = opts.args[1];

          const task = async () => {
            const { appRouter, createContext } = await configQrl(event);
            return trpcResolver({ appRouter, args, createContext, dotPath });
          };

          return task();
        }
        case "routeAction$": {
          return trpcRouteActionResolver$(
            () => ({ configQrl, dotPath }),
            dotPath
          );
        }
      }
    }, []) as DecoratedProcedureRecord<TRouter["_def"]["record"]>,
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
