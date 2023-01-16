import type { Cookie } from "@builder.io/qwik-city";
import type { RequestContext } from "@builder.io/qwik-city/middleware/request-handler";
import { createClient, Session } from "@supabase/supabase-js";
import { serverEnv } from "../serverEnv";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);

const cookieName = "RJ-auth";

export const updateAuthCookies = (
  session: Partial<Session>,
  cookie: Cookie
) => {
  const value = JSON.stringify({
    "access-token": session.access_token,
    "refresh-token": session.refresh_token,
  });
  cookie.set(cookieName, value, {
    httpOnly: true,
    maxAge: session.expires_in,
    path: "/",
    sameSite: "lax",
  });
};

export const setAuthCookies = async (
  request: RequestContext,
  cookie: Cookie
) => {
  const json = await request.json();

  updateAuthCookies(json, cookie);
};

export const removeAuthCookies = (cookie: Cookie) => {
  cookie.set(cookieName, "value", {
    httpOnly: true,
    maxAge: -1,
    path: "/",
    sameSite: "lax",
  });
};

export const getUserByCookie = async (cookie: Cookie) => {
  const cookieHeader = cookie.get(cookieName);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const value = cookieHeader?.json() as any;
  const token = value?.["access-token"];

  if (!token) {
    return null;
  }

  const { data } = await supabase.auth.getUser(token);
  return data;
};
