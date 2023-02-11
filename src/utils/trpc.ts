/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $, QRL } from "@builder.io/qwik";
import { Action, ActionStore } from "@builder.io/qwik-city";
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  inferRouterInputs,
  inferRouterOutputs,
  ProcedureRouterRecord,
  TRPCError,
} from "@trpc/server";
import type { AppRouter } from "~/server/trpc/router";

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

type ProxyCallbackOptions = {
  path: string[];
  args: unknown[];
};

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

type TrpcActionResultOptional<TProcedure extends AnyProcedure> =
  | {
      failed: false;
      data: inferProcedureOutput<TProcedure>;
    }
  | {
      failed: true;
      error: TRPCError[];
    };

type Resolver<TProcedure extends AnyProcedure> = (
  input: inferProcedureInput<TProcedure>
) => Promise<TrpcActionResultOptional<TProcedure>>;

type UseTrpcActionResult<TProcedure extends AnyProcedure> = [
  ActionStore<
    TrpcActionResultOptional<TProcedure>,
    inferProcedureInput<TProcedure>
  >,
  QRL<Resolver<TProcedure>>
];

type DecorateProcedure<TProcedure extends AnyProcedure> =
  TProcedure extends AnyQueryProcedure
    ? () => UseTrpcActionResult<TProcedure>
    : TProcedure extends AnyMutationProcedure
    ? () => UseTrpcActionResult<TProcedure>
    : never;

type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"]>
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
};

export const useTrpcAction = (action: Action<any, any>) => {
  const actionStore = action.use();
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
  return createRecursiveProxy((opts) => {
    const dotPath = opts.path.join(".");

    const run = $(async (input: any) => {
      const formData = new FormData();
      formData.set("path", dotPath);

      const stringifiedInput = input !== undefined && JSON.stringify(input);

      if (stringifiedInput !== false) {
        formData.set("body", stringifiedInput);
      }

      await actionStore.run(formData);

      const value = actionStore.value;

      if (value.failed) {
        return value;
      }

      return { data: value };
    });

    return [actionStore, run];
  }, []) as DecoratedProcedureRecord<AppRouter["_def"]["record"]>;
};
