import { RequestContext, ResponseContext } from "@builder.io/qwik-city";
import { createClient, Session } from "@supabase/supabase-js";
import cookie from "cookie";
import { serverEnv } from "./serverEnv";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);

const cookieName = "RJ";

const updateAuthCookies = async (
  session: Partial<Session>,
  response: ResponseContext
) => {
  response.headers.delete("Set-Cookie");

  [
    { key: "access-token", value: session.access_token },
    { key: "refresh-token", value: session.refresh_token },
  ].forEach((token) => {
    if (!token.value) return null;

    const name = `${cookieName}-${token.key}`;
    const serialized = cookie.serialize(name, token.value, {
      maxAge: session.expires_in,
      path: "/",
      sameSite: "lax",
    });

    response.headers.append("Set-Cookie", serialized);
  });
};

export const setAuthCookies = async (
  request: RequestContext,
  response: ResponseContext
) => {
  const json = await request.json();

  updateAuthCookies(json, response);
};

export const removeAuthCookies = async (response: ResponseContext) => {
  updateAuthCookies(
    { access_token: "removed", expires_in: -1, refresh_token: "removed" },
    response
  );
};

export const getUserByCookie = async (request: RequestContext) => {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) return null;

  const cookies = cookie.parse(cookieHeader);
  const token = cookies[`${cookieName}-access-token`];

  if (!token) return null;

  const { user } = await supabase.auth.api.getUser(token);

  return user;
};
