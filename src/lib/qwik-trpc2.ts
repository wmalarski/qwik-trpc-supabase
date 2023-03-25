/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $, implicit$FirstArg, type QRL } from "@builder.io/qwik";
import {
  globalAction$,
  routeAction$,
  type RequestEvent,
  type RequestEventCommon,
} from "@builder.io/qwik-city";
import type { TRPCError } from "@trpc/server";
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

type TrpcCallerFactory = QRL<
  (
    event: RequestEventCommon
  ) => Promise<ReturnType<typeof appRouter.createCaller>>
>;

type TrpcHandleRequestArgs = {
  event: RequestEventCommon;
  args: any;
  dotPath: string[];
};

export const trpcRequestHandlerQrl = (getTrpc: TrpcCallerFactory) => {
  return async ({ event, args, dotPath }: TrpcHandleRequestArgs) => {
    const trpc = await getTrpc(event);

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

// type TrpcHandlerArgs = {
//   event: RequestEventCommon;
//   args: any;
// };

type TrpcHandlerConfig = {
  dotPath: string[];
  caller: TrpcCallerFactory;
};

// export const trpcHandlerQrl = (
//   trpcQrl: QRL<(event: RequestEventCommon) => Promise<TrpcHandlerConfig>>
// ) => {
//   return $(async ({ args, event }: TrpcHandlerArgs) => {
//     const config = await trpcQrl(event);

//     console.log("trpcHandlerQrl", config.dotPath);

//     const fnc = config.dotPath.reduce(
//       (prev, curr) => prev[curr],
//       config.caller as any
//     );

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
//   });
// };

// export const trpcHandler$ = implicit$FirstArg(trpcHandlerQrl);

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

export const getRandomActionId = () => {
  return String(Math.floor(Math.random() * 1e11));
};

export const trpcGlobalActionQrl = (
  trpcQrl: QRL<(event: RequestEventCommon) => TrpcHandlerConfig>
) => {
  // eslint-disable-next-line qwik/loader-location
  return globalAction$(
    async (args, event) => {
      console.log("globalAction$-0", args, event);
      const { caller, dotPath } = await trpcQrl(event);
      console.log("globalAction$-1", caller, dotPath);
      const handler = trpcRequestHandler$((event) => caller(event));
      console.log("globalAction$-2", handler);
      return handler({ args, dotPath, event });
    },
    { id: getRandomActionId() }
  );
};

export const trpcGlobalAction$ = implicit$FirstArg(trpcGlobalActionQrl);

export const trpcRouteActionQrl = (
  trpcQrl: QRL<(event: RequestEventCommon) => Promise<TrpcHandlerConfig>>
) => {
  // eslint-disable-next-line qwik/loader-location
  return routeAction$(
    async (args, event) => {
      const { caller, dotPath } = await trpcQrl(event);
      const handler = trpcRequestHandler$((event) => caller(event));
      return handler({ args, dotPath, event });
    },
    { id: getRandomActionId() }
  );
};

export const trpcRouteAction$ = implicit$FirstArg(trpcRouteActionQrl);

export const trpcFetchQrl = (dotPathQrl: QRL<() => string[]>) => {
  // eslint-disable-next-line prefer-arrow-callback

  return $(async (args: any) => {
    const dotPath = await dotPathQrl();
    const body = JSON.stringify(args);

    console.log({ body, dotPath });

    const response = await fetch(`/api/trpc/${dotPath}`, { body });
    return response.json();
    // return fnc({ ...args, __dotPath: dotPath });
  });
};

export const trpcFetch$ = implicit$FirstArg(trpcFetchQrl);

/*

import { RequestHandler } from "@builder.io/qwik-city";
import { resolveHTTPResponse } from "@trpc/server/http";
import { createContext } from "~/server/trpc/context";
import { appRouter } from "~/server/trpc/router/index";

const handler: RequestHandler = async (ev) => {
  const headers: Record<string, string> = {};
  ev.request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    const res = await resolveHTTPResponse({
      createContext: () => createContext(ev),
      path: ev.params.trpc,
      req: {
        body: await ev.request.text(),
        headers,
        method: ev.request.method,
        query: new URL(ev.request.url).searchParams,
      },
      router: appRouter,
    });

    for (const key in res.headers) {
      const value = res.headers[key] as string;
      ev.headers.set(key, value);
    }

    ev.status(res.status);
    return JSON.parse(res.body as string);
  } catch (error) {
    ev.status(500);
    return "Internal Server Error";
  }
};

export const onGet = handler;
export const onPost = handler;
export const onPut = handler;
export const onDelete = handler;
export const onPatch = handler;
export const onHead = handler;
export const onOptions = handler;


*/

export const trpcOnRequestQrl = (trpcQrl: TrpcCallerFactory) => {
  return $(async (event: RequestEvent) => {
    const handler = trpcRequestHandler$((event) => trpcQrl(event));
    const args = await event.request.text();

    console.log({ args, url: event.url });

    return handler({ args, dotPath: ["post", "updates"], event });
  });
};

export const trpcOnRequest$ = implicit$FirstArg(trpcOnRequestQrl);
