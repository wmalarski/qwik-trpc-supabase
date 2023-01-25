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
    maxAge: session.expires_in,
    path: "/",
    sameSite: "lax",
  } as const;

  cookie.set(accessTokenCookieName, session.access_token, options);
  cookie.set(refreshTokenCookieName, session.refresh_token, options);
};

export const removeAuthCookies = (cookie: Cookie) => {
  const options = {
    httpOnly: true,
    maxAge: -1,
    path: "/",
    sameSite: "lax",
  } as const;

  cookie.set(accessTokenCookieName, "", options);
  cookie.set(refreshTokenCookieName, "", options);
};

export const getUserByCookie = async (
  event: RequestEventLoader | RequestEvent
) => {
  const accessToken = event.cookie.get(accessTokenCookieName);

  if (!accessToken?.value) {
    return null;
  }

  const { data } = await supabase.auth.getUser(accessToken.value);

  return data.user;
};
