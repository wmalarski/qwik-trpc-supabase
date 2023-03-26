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
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureRouterRecord,
} from "@trpc/server";
import type { ZodIssue } from "zod";
import type { appRouter } from "~/server/trpc/router";

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
        fetch: () => (
          input: inferProcedureInput<TProcedure>
        ) => Promise<TrpcProcedureOutput<TProcedure>>;
      }
    : TProcedure extends AnyMutationProcedure
    ? {
        globalAction: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          false
        >;
        routeAction: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          false
        >;
        fetch: () => (
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

type TrpcCaller = ReturnType<typeof appRouter.createCaller>;

type TrpcCallerOptions = {
  prefix: string;
};

type TrpcResolver = {
  dotPath: string[];
  callerQrl: QRL<(event: RequestEventCommon) => Promise<TrpcCaller>>;
};

export const trpcGlobalActionResolverQrl = (
  contextQrl: QRL<() => TrpcResolver>,
  dotPath: string[]
) => {
  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      const context = await contextQrl();
      const caller = await context.callerQrl(event);

      return dotPath.reduce((prev, curr) => prev[curr], caller as any)(args);
    },
    { id: dotPath.join(".") }
  );
};

export const trpcGlobalActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcGlobalActionResolverQrl
);

export const trpcRouteActionResolverQrl = (
  contextQrl: QRL<() => TrpcResolver>,
  dotPath: string[]
) => {
  // eslint-disable-next-line qwik/loader-location
  return routeAction$(
    async (args, event) => {
      const context = await contextQrl();
      const caller = await context.callerQrl(event);

      return dotPath.reduce((prev, curr) => prev[curr], caller as any)(args);
    },
    { id: dotPath.join(".") }
  );
};

export const trpcRouteActionResolver$ = /*#__PURE__*/ implicit$FirstArg(
  trpcRouteActionResolverQrl
);

export const serverTrpcQrl = <TRouter extends AnyRouter>(
  callerQrl: QRL<(event: RequestEventCommon) => Promise<TrpcCaller>>,
  options: TrpcCallerOptions
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
    trpcPlugin: createRecursiveProxy((opts) => {
      const dotPath = opts.path.slice(0, -1);
      const action = opts.path[opts.path.length - 1];

      switch (action) {
        case "fetch": {
          return async (args: any) => {
            const path = dotPath.join(".");

            const response = await fetch(`${options.prefix}/${path}`, {
              body: JSON.stringify(args),
              method: "POST",
            });

            const result = await response.json();

            return { result, status: "success" };
          };
        }
        case "globalAction": {
          return trpcGlobalActionResolver$(
            () => ({ callerQrl, dotPath }),
            dotPath
          );
        }
        case "loader": {
          const event = opts.args[0] as RequestEventLoader;
          const args = opts.args[1];

          const task = async () => {
            const caller = await callerQrl(event);

            const result = await dotPath.reduce(
              (prev, curr) => prev[curr],
              caller as any
            )(args);

            return { result, status: "success" };
          };

          return task();
        }
        case "routeAction": {
          return trpcRouteActionResolver$(
            () => ({ callerQrl, dotPath }),
            dotPath
          );
        }
      }
    }, []) as DecoratedProcedureRecord<TRouter["_def"]["record"]>,
  };
};

export const serverTrpc$ = /*#__PURE__*/ implicit$FirstArg(serverTrpcQrl);
