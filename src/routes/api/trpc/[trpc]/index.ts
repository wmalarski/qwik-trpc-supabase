import { RequestHandler } from "@builder.io/qwik-city";

const handler: RequestHandler = async (ev) => {
  const { resolveHTTPResponse } = await import("@trpc/server/http");
  const { appRouter } = await import("~/server/trpc/router/index");
  const { createContext } = await import("~/server/trpc/context");

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
      ev.response.headers.set(key, value);
    }

    ev.response.status = res.status;
    return JSON.parse(res.body as string);
  } catch (error) {
    ev.response.status = 500;
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
