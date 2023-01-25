import type { Cookie, RequestEvent } from "@builder.io/qwik-city";
import { createClient, Session } from "@supabase/supabase-js";
import type { RequestEventLoader } from "~/utils/types";
import { serverEnv } from "../serverEnv";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);

const accessTokenCookieName = "sb-access-token";
const refreshTokenCookieName = "sb-refresh-token";

export const updateAuthCookies = (
  session: Pick<Session, "refresh_token" | "expires_in" | "access_token">,
  cookie: Cookie
) => {
  const options = {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "lax",
  } as const;

  cookie.set(accessTokenCookieName, session.access_token, options);
  cookie.set(refreshTokenCookieName, session.refresh_token, options);
};

export const removeAuthCookies = (cookie: Cookie) => {
  // const options = {
  //   httpOnly: true,
  //   maxAge: 0,
  //   path: "/",
  //   sameSite: "lax",
  // } as const;

  cookie.delete(accessTokenCookieName, { path: "/", domain: "localhost" });
  cookie.delete(refreshTokenCookieName, { path: "/", domain: "localhost" });
  // cookie.set(accessTokenCookieName, "", options);
  // cookie.set(refreshTokenCookieName, "", options);
};

export const getUserByCookie = async (
  event: RequestEventLoader | RequestEvent
) => {
  const accessToken = event.cookie.get(accessTokenCookieName)?.value;
  const refreshToken = event.cookie.get(refreshTokenCookieName)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const userResponse = await supabase.auth.getUser(accessToken);

  console.log(
    JSON.stringify({ userResponse, accessToken, refreshToken }, null, 2)
  );

  if (userResponse.data.user) {
    return userResponse.data.user;
  }

  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  console.log(JSON.stringify({ refreshResponse }, null, 2));

  if (!refreshResponse.data.session) {
    removeAuthCookies(event.cookie);

    console.log("remove", event.cookie.headers());

    return null;
  }

  const session = refreshResponse.data.session;

  updateAuthCookies(session, event.cookie);

  console.log("update", event.cookie.headers());

  return session.user;
};
