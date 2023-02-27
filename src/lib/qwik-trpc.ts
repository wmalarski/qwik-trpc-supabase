/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $ } from "@builder.io/qwik";
import {
  Action,
  action$,
  RequestEventCommon,
  RequestEventLoader,
} from "@builder.io/qwik-city";
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureRouterRecord,
  TRPCError,
} from "@trpc/server";
import { ZodIssue } from "zod";
import { getTrpcFromEvent } from "~/server/loaders";

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
      }
    : TProcedure extends AnyMutationProcedure
    ? {
        action$: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          false
        >;
      }
    : never;

type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"]>
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
};

type HandleRequestArgs = {
  event: RequestEventCommon;
  args: any;
  dotPath: string[];
};

export const createTrpcServerApi = <TRouter extends AnyRouter>() => {
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

  const handleRequest = $(
    async ({ event, args, dotPath }: HandleRequestArgs) => {
      const trpc = await getTrpcFromEvent(event);

      const fnc = dotPath.reduce((prev, curr) => prev[curr], trpc as any);

      try {
        const result = await fnc(args);
        return { result, status: "success" };
      } catch (err) {
        const trpcError = err as TRPCError;
        const error = {
          code: trpcError.code,
          issues: JSON.parse(trpcError.message),
          status: "error",
        };
        return error;
      }
    }
  );

  return createRecursiveProxy((opts) => {
    const dotPath = opts.path.slice(0, -1);
    const action = opts.path[opts.path.length - 1];

    if (action === "loader") {
      const event = opts.args[0] as RequestEventLoader;
      const args = opts.args[1];
      return handleRequest({ args, dotPath, event });
    }
    if (action === "action$") {
      // kind of YOLO lifestyle
      // eslint-disable-next-line qwik/loader-location
      return action$(
        (args, event) => {
          const [, ...rest] = event.query.get("qaction")?.split("_") || [];
          const dotPath = rest.join("_").split(".") || [];
          return handleRequest({ args, dotPath, event });
        },
        { id: dotPath.join(".") }
      );
    }
  }, []) as DecoratedProcedureRecord<TRouter["_def"]["record"]>;
};
