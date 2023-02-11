import type { RequestEventAction } from "@builder.io/qwik-city/middleware/request-handler";
import { resolveHTTPResponse } from "@trpc/server/http";
import { createContext } from "./context";
import { appRouter } from "./router/index";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const trpcAction = async (data: any, event: RequestEventAction) => {
  const headers: Record<string, string> = {};
  event.request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    const res = await resolveHTTPResponse({
      createContext: () => createContext(event),
      path: data.path as string,
      req: {
        body: data.body,
        headers,
        method: "POST",
        query: new URLSearchParams(),
      },
      router: appRouter,
    });

    for (const key in res.headers) {
      const value = res.headers[key] as string;
      event.headers.set(key, value);
    }

    event.status(res.status);

    if (!res.body) {
      return event.fail(500, { formErrors: ["Internal Server Error"] });
    }

    const body = JSON.parse(res.body);

    if (res.status >= 400) {
      const message = JSON.parse(body.error.message);
      return event.fail(res.status, { errors: message });
    }

    return body.result;
  } catch (error) {
    return event.fail(500, { formErrors: ["Internal Server Error"] });
  }
};
