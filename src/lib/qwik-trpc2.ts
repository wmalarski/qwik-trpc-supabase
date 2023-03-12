/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $, implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  server$,
  type RequestEventCommon,
} from "@builder.io/qwik-city";
import type { TRPCError } from "@trpc/server";
import { getTrpcFromEvent } from "~/server/loaders";
import type { appRouter } from "~/server/trpc/router";

// type ProxyCallbackOptions = {
//   path: string[];
//   args: unknown[];
// };

// type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

// type TrpcProcedureOutput<TProcedure extends AnyProcedure> =
//   | {
//       result: inferProcedureOutput<TProcedure>;
//       status: "success";
//     }
//   | {
//       code: ZodIssue["code"];
//       status: "error";
//       issues: ZodIssue[];
//     };

// type DecorateProcedure<TProcedure extends AnyProcedure> =
//   TProcedure extends AnyQueryProcedure
//     ? {
//         loader: (
//           event: RequestEventLoader,
//           input: inferProcedureInput<TProcedure>
//         ) => TrpcProcedureOutput<TProcedure>;
//         query: () => TypedServerFunction<
//           inferProcedureInput<TProcedure>,
//           TrpcProcedureOutput<TProcedure>
//         >;
//       }
//     : TProcedure extends AnyMutationProcedure
//     ? {
//         action$: () => Action<
//           TrpcProcedureOutput<TProcedure>,
//           inferProcedureInput<TProcedure>,
//           false
//         >;
//         mutate: () => TypedServerFunction<
//           inferProcedureInput<TProcedure>,
//           TrpcProcedureOutput<TProcedure>
//         >;
//       }
//     : never;

// type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
//   [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
//     ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"]>
//     : TProcedures[TKey] extends AnyProcedure
//     ? DecorateProcedure<TProcedures[TKey]>
//     : never;
// };

type HandleRequestArgs = {
  event: RequestEventCommon;
  args: any;
  dotPath: string[];
};

export const trpcRequestHandlerQrl = (
  getTrpc: QRL<
    (event: RequestEventCommon) => ReturnType<typeof getTrpcFromEvent>
  >
) => {
  return async ({ event, args, dotPath }: HandleRequestArgs) => {
    const trpcGetter = await getTrpc.resolve();
    const trpc = await trpcGetter(event);

    const fnc = dotPath.reduce((prev, curr) => prev[curr], trpc as any);

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
};

export const trpcRequestHandler$ = implicit$FirstArg(trpcRequestHandlerQrl);

type TrpcHandlerArgs = {
  event: RequestEventCommon;
  args: any;
};

type TrpcHandlerConfig = {
  dotPath: string[];
  caller: ReturnType<typeof appRouter.createCaller>;
};

export const trpcHandlerQrl = (
  trpcQrl: QRL<(event: RequestEventCommon) => Promise<TrpcHandlerConfig>>
) => {
  return $(async ({ args, event }: TrpcHandlerArgs) => {
    const config = await trpcQrl(event);

    console.log("trpcHandlerQrl", config.dotPath);

    const fnc = config.dotPath.reduce(
      (prev, curr) => prev[curr],
      config.caller as any
    );

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
  });
};

export const trpcHandler$ = implicit$FirstArg(trpcHandlerQrl);

// export const createTrpcServerApiQrl = <TRouter extends AnyRouter>(
//   getTrpc: QRL<
//     (event: RequestEventCommon) => ReturnType<typeof getTrpcFromEvent>
//   >
// ) => {
//   // const createRecursiveProxy = (callback: ProxyCallback, path: string[]) => {
//   //   const proxy: unknown = new Proxy(() => void 0, {
//   //     apply(_1, _2, args) {
//   //       return callback({ args, path });
//   //     },
//   //     get(_obj, key) {
//   //       if (typeof key !== "string") {
//   //         return undefined;
//   //       }
//   //       return createRecursiveProxy(callback, [...path, key]);
//   //     },
//   //   });

//   //   return proxy;
//   // };

//   const handleRequest = async ({ event, args, dotPath }: HandleRequestArgs) => {
//     // TODO Do we need resolve??
//     const trpcGetter = await getTrpc.resolve();
//     const trpc = await trpcGetter(event);

//     const fnc = dotPath.reduce((prev, curr) => prev[curr], trpc as any);

//     const safeParse = (data: string) => {
//       try {
//         return JSON.parse(data);
//       } catch {
//         return data;
//       }
//     };

//     try {
//       const result = await fnc(args);

//       return { result, status: "success" };
//     } catch (err) {
//       const trpcError = err as TRPCError;
//       const error = {
//         code: trpcError.code,
//         issues: safeParse(trpcError.message),
//         status: "error",
//       };
//       return error;
//     }
//   };

//   // return createRecursiveProxy((opts) => {
//   //   const dotPath = opts.path.slice(0, -1);
//   //   const action = opts.path[opts.path.length - 1];

//   //   if (action === "loader") {
//   //     const event = opts.args[0] as RequestEventLoader;
//   //     const args = opts.args[1];

//   //     return handleRequest({ args, dotPath, event });
//   //   }
//   //   if (action === "query" || action === "mutate") {
//   //     const serverFnc: ServerFunction = function (args) {
//   //       return handleRequest({ args, dotPath, event: this });
//   //     };
//   //     return serverFnc;
//   //   }
//   // }, []) as DecoratedProcedureRecord<TRouter["_def"]["record"]>;
// };

// if (action === "action$") {
//   // eslint-disable-next-line qwik/loader-location
//   return routeAction$(
//     (args, event) => {
//       const [, ...rest] = event.query.get("qaction")?.split("_") || [];
//       const dotPath = rest.join("_").split(".") || [];

//       return handleRequest({ args, dotPath, event });
//     },
//     { id: dotPath.join(".") }
//   );
// }

// type TrpcGlobalActionQrlArgs = {
//   dotPath: string[];
//   trpcQrl: QRL<
//     (
//       event: RequestEventCommon
//     ) => Promise<ReturnType<typeof appRouter.createCaller>>
//   >;
// };

export const trpcGlobalActionQrl = (
  trpcQrl: QRL<(event: RequestEventCommon) => Promise<TrpcHandlerConfig>>
) => {
  // eslint-disable-next-line qwik/loader-location
  return globalAction$((args, event) => {
    const handler = trpcHandler$((event) => trpcQrl(event));
    return handler({ args, event });
  });
};

export const trpcGlobalAction$ = implicit$FirstArg(trpcGlobalActionQrl);

export const trpcRouteActionQrl = (
  trpcQrl: QRL<(event: RequestEventCommon) => Promise<TrpcHandlerConfig>>
) => {
  // eslint-disable-next-line qwik/loader-location
  return routeAction$((args, event) => {
    const handler = trpcHandler$((event) => trpcQrl(event));
    return handler({ args, event });
  });
};

export const trpcRouteAction$ = implicit$FirstArg(trpcRouteActionQrl);

export const trpcFetchQrl = (dotPathQrl: QRL<() => string[]>) => {
  // eslint-disable-next-line prefer-arrow-callback
  const fnc = server$(function (args: any) {
    const dotPath = args.__dotPath;

    const handler = trpcRequestHandler$((event) => getTrpcFromEvent(event));

    return handler({ args, dotPath, event: this });
  });

  return $(async (args: any) => {
    const dotPath = await dotPathQrl();
    return fnc({ ...args, __dotPath: dotPath });
  });
};

export const trpcFetch$ = implicit$FirstArg(trpcFetchQrl);
