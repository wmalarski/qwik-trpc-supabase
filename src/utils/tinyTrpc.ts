/**
 * @see https://trpc.io/blog/tinyrpc-client
 */
import { $ } from "@builder.io/qwik";
import type {
  AnyMutationProcedure,
  AnyProcedure,
  AnyQueryProcedure,
  AnyRouter,
  inferProcedureInput,
  inferProcedureOutput,
  ProcedureRouterRecord,
} from "@trpc/server";
import type { TRPCResponse } from "@trpc/server/rpc";
import type { AppRouter } from "~/server/trpc/router";
import type { ServerActionUtils } from "./types";

type ProxyCallbackOptions = {
  path: string[];
  args: unknown[];
};

type ProxyCallback = (opts: ProxyCallbackOptions) => unknown;

type Resolver<TProcedure extends AnyProcedure> = (
  action: ServerActionUtils<TRPCResponse>,
  input: inferProcedureInput<TProcedure>
) => Promise<inferProcedureOutput<TProcedure>>;

type DecorateProcedure<TProcedure extends AnyProcedure> =
  TProcedure extends AnyQueryProcedure
    ? {
        query: Resolver<TProcedure>;
      }
    : TProcedure extends AnyMutationProcedure
    ? {
        mutate: Resolver<TProcedure>;
      }
    : never;

type DecoratedProcedureRecord<TProcedures extends ProcedureRouterRecord> = {
  [TKey in keyof TProcedures]: TProcedures[TKey] extends AnyRouter
    ? DecoratedProcedureRecord<TProcedures[TKey]["_def"]["record"]>
    : TProcedures[TKey] extends AnyProcedure
    ? DecorateProcedure<TProcedures[TKey]>
    : never;
};

export const createTinyRPCClient = $(() => {
  return () => {
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
    return createRecursiveProxy(async (opts) => {
      const path = [...opts.path];

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      path.pop()! as "query" | "mutate";
      const dotPath = path.join(".");

      const formData = new FormData();
      formData.set("path", dotPath);

      const [action, input] = opts.args as Parameters<Resolver<AnyProcedure>>;

      const stringifiedInput =
        input !== undefined && JSON.stringify({ json: input });
      let body: undefined | string = undefined;
      if (stringifiedInput !== false) {
        body = stringifiedInput;
        formData.set("body", body);
      }

      const json: TRPCResponse = await action.execute(formData);

      if (json && "error" in json) {
        throw new Error(`Error: ${json.error.message}`);
      }

      return json.result.data;
    }, []) as DecoratedProcedureRecord<AppRouter["_def"]["record"]>;
  };
});

export const useTinyTrpc = () => {
  return createTinyRPCClient;
};
