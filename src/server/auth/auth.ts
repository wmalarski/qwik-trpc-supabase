import { createClient, Session } from "@supabase/supabase-js";
import { serverEnv } from "../serverEnv";
import type { ServerEvent } from "../types";

export const supabase = createClient(
  serverEnv.VITE_SUPABASE_URL,
  serverEnv.VITE_SUPABASE_ANON_KEY
);

const accessTokenCookieName = "sb-access-token";
const refreshTokenCookieName = "sb-refresh-token";

export const updateAuthCookies = (
  event: ServerEvent,
  session: Pick<Session, "refresh_token" | "expires_in" | "access_token">
) => {
  const options = {
    httpOnly: true,
    maxAge: 610000,
    path: "/",
    sameSite: "lax",
  } as const;

  event.cookie.set(accessTokenCookieName, session.access_token, options);
  event.cookie.set(refreshTokenCookieName, session.refresh_token, options);
};

export const removeAuthCookies = (event: ServerEvent) => {
  event.cookie.delete(accessTokenCookieName);
  event.cookie.delete(refreshTokenCookieName);
};

export const getUserByCookie = async (event: ServerEvent) => {
  const accessToken = event.cookie.get(accessTokenCookieName)?.value;
  const refreshToken = event.cookie.get(refreshTokenCookieName)?.value;

  if (!accessToken || !refreshToken) {
    return null;
  }

  const userResponse = await supabase.auth.getUser(accessToken);

  if (userResponse.data.user) {
    return userResponse.data.user;
  }

  // Refreshing is not working for now because it's
  // not possible to send new cookies from loader$
  // server function :(
  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  if (!refreshResponse.data.session) {
    removeAuthCookies(event);
    return null;
  }

  const session = refreshResponse.data.session;
  updateAuthCookies(event, session);
  return session.user;
};
