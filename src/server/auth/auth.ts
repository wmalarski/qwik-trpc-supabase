// Code copied from
// https://gist.github.com/langbamit/a09161e844ad9b4a3cb756bacde67796
import type {
  RequestContext,
  RequestEvent,
  RequestHandler,
  ResponseContext,
} from "@builder.io/qwik-city";
import * as cookie from "cookie";
import { NextAuthHandler } from "next-auth/core";
import { Cookie } from "next-auth/core/lib/cookie";
import type {
  NextAuthAction,
  NextAuthOptions,
  Session,
} from "next-auth/core/types";
import { authOptions } from "./options";

const getBody = (formData: FormData | null): Record<string, any> => {
  const data: Record<string, any> = {};
  (formData || []).forEach((value, key) => {
    if (key in data)
      data[key] = Array.isArray(data[key])
        ? [...data[key], value]
        : [data[key], value];
    else data[key] = value;
  }, {});
  return data;
};

export const setCookies = (response: ResponseContext, cookies?: Cookie[]) => {
  if (!cookies) return;
  for (const c of cookies) {
    response.headers.set(
      "set-cookie",
      cookie.serialize(c.name, c.value, c.options)
    );
  }
};

const QwikNextAuthHandler = async (event: RequestEvent) => {
  const { request, params, url, response } = event;
  const [action, providerId] = params.nextauth!.split("/");

  let body = undefined;
  try {
    const formData = await request.formData();
    body = getBody(formData);
  } catch (error) {
    // no formData passed
  }
  const query = Object.fromEntries(url.searchParams);

  const requestCookies = getCookie(request.headers);

  console.log("QwikNextAuthHandler", {
    query,
    requestCookies,
  });

  const res = await NextAuthHandler({
    options: authOptions,
    req: {
      host: process.env.NEXTAUTH_URL,
      body,
      query,
      headers: request.headers,
      method: request.method,
      cookies: requestCookies,
      action: action as NextAuthAction,
      providerId,
      error: (query.error as string | undefined) ?? providerId,
    },
  });

  const { cookies, redirect, headers, status } = res;

  for (const header of headers || []) {
    response.headers.append(header.key, header.value);
  }
  setCookies(
    response,
    cookies?.filter((c) => !(c.name === "next-auth.state") || !!c.value) // workaround for Qwik
  );

  if (redirect) {
    if (body?.json !== "true") {
      throw response.redirect(redirect, 302);
    }
    response.headers.set("Content-Type", "application/json");
    return { url: redirect };
  }

  response.status = status || 200;

  return res.body;
};

export const getCookie = (headers: Headers) =>
  cookie.parse(headers.get("cookie") || "");

export const getServerSession = async (
  event: RequestEvent
): Promise<Session | null> => {
  const { request, response } = event;
  const res = await NextAuthHandler({
    options: authOptions,
    req: {
      host: process.env.NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "session",
    },
  });
  const { body, cookies } = res;

  setCookies(response, cookies);

  if (body && typeof body !== "string" && Object.keys(body).length) {
    return body as Session;
  }
  return null;
};

export const getServerCsrfToken = async (request: RequestContext) => {
  const { body } = await NextAuthHandler({
    options: authOptions,
    req: {
      host: process.env.NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "csrf",
    },
  });
  return (body as { csrfToken: string }).csrfToken;
};

export type PublicProvider = {
  id: string;
  name: string;
  type: string;
  signInUrl: string;
  callbackUrl: string;
};

export const getServerProviders = async (request: RequestContext) => {
  const { body } = await NextAuthHandler({
    options: authOptions,
    req: {
      host: process.env.NEXTAUTH_URL,
      headers: request.headers,
      method: "GET",
      cookies: getCookie(request.headers),
      action: "providers",
    },
  });
  if (body && typeof body !== "string") {
    return body as Record<string, PublicProvider>;
  }
  return null;
};

export const NextAuth = (): {
  onGet: RequestHandler;
  onPost: RequestHandler;
} => ({
  onGet: (event) => QwikNextAuthHandler(event),
  onPost: (event) => QwikNextAuthHandler(event),
});

export { NextAuthOptions };
