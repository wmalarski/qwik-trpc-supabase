/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $ } from "@builder.io/qwik";
import {
  Action,
  action$,
  Loader,
  loader$,
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
import type { AppRouter } from "~/server/trpc/router";

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
        loader$: (
          args:
            | inferProcedureInput<TProcedure>
            | ((event: RequestEventLoader) => inferProcedureInput<TProcedure>)
            | ((
                event: RequestEventLoader
              ) => Promise<inferProcedureInput<TProcedure>>)
        ) => Loader<TrpcProcedureOutput<TProcedure>>;
      }
    : TProcedure extends AnyMutationProcedure
    ? {
        action$: () => Action<
          TrpcProcedureOutput<TProcedure>,
          inferProcedureInput<TProcedure>,
          true
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

export const serverTrpc = () => {
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

    if (action === "loader$") {
      return loader$(async (event) => {
        const input = opts.args[0];
        const args = typeof input === "function" ? await input(event) : input;
        return handleRequest({ args, dotPath, event });
      });
    }

    if (action === "action$") {
      return action$(async (args, event) => {
        return handleRequest({ event, args, dotPath });
      });
    }
  }, []) as DecoratedProcedureRecord<AppRouter["_def"]["record"]>;
};
