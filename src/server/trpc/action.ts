import { resolveHTTPResponse } from "@trpc/server/http";
import type { RequestEventLoader } from "~/utils/types";
import { createContext } from "./context";
import { appRouter } from "./router/index";

export const trpcAction = async (form: FormData, event: RequestEventLoader) => {
  const headers: Record<string, string> = {};
  event.request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  try {
    const body = form.get("body");
    const path = form.get("path") as string;

    const res = await resolveHTTPResponse({
      createContext: () => createContext(event),
      path,
      req: {
        body,
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
    return JSON.parse(res.body as string);
  } catch (error) {
    event.status(500);
    return "Internal Server Error";
  }
};
