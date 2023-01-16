import { loader$ } from "@builder.io/qwik-city";

type LoaderParameter = Parameters<typeof loader$>[0];
export type RequestEventLoader = Parameters<LoaderParameter>[0];

type HandlerBuilderResult<R extends RequestEventLoader> = {
  action: <T>(
    inner: (form: FormData, e: R) => T | Promise<T>
  ) => (form: FormData, e: RequestEventLoader) => T | Promise<T>;
  loader: <T>(
    inner: (e: R) => T | Promise<T>
  ) => (e: RequestEventLoader) => T | Promise<T>;
  use: <N extends R>(
    middleware: (r: R) => N | Promise<N>
  ) => HandlerBuilderResult<N>;
};

const handlerBuilderInner = <R extends RequestEventLoader = RequestEventLoader>(
  h: (e: RequestEventLoader) => R | Promise<R>
): HandlerBuilderResult<R> => {
  return {
    action: (inner) => async (f, e) => inner(f, await h(e)),
    loader: (inner) => async (e) => inner(await h(e)),
    use: (middle) => handlerBuilderInner(async (e) => middle(await h(e))),
  };
};

export const endpointBuilder = (): HandlerBuilderResult<RequestEventLoader> => {
  return {
    action: (inner) => inner,
    loader: (inner) => inner,
    use: (middle) => handlerBuilderInner((e) => middle(e)),
  };
};
