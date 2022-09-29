import { RequestContext, ResponseContext } from "@builder.io/qwik-city";
import { createClient } from "@supabase/supabase-js";
import cookie from "cookie";
import { serverEnv } from "./serverEnv";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);

const cookieName = "RJ";

export const getAuthCookieString = async (
  request: RequestContext,
  response: ResponseContext
) => {
  const json = await request.json();

  response.headers.delete("Set-Cookie");

  [
    { key: "access-token", value: json.access_token },
    { key: "refresh-token", value: json.refresh_token },
  ]
    .map((token) => {
      return cookie.serialize(`${cookieName}-${token.key}`, token.value, {
        domain: "",
        maxAge: +json.expires_in,
        path: "/",
        sameSite: "lax",
      });
    })
    .forEach((cookieValue) => {
      response.headers.append("Set-Cookie", cookieValue);
    });
};

export const getUserByRequest = async (request: RequestContext) => {
  const cookieHeader = request.headers.get("Cookie");

  if (!cookieHeader) return null;

  const cookies = cookie.parse(cookieHeader);
  const token = cookies[`${cookieName}-access-token`];

  if (!token) return null;

  const { user } = await supabase.auth.api.getUser(token);

  return user;
};
