import {
  z,
  type CookieOptions,
  type RequestEventCommon,
} from "@builder.io/qwik-city";
import { type Session } from "@supabase/supabase-js";
import { createSupabase } from "./supabase";

const cookieName = "_session";

const options: CookieOptions = {
  httpOnly: true,
  maxAge: 610000,
  path: "/",
  sameSite: "lax",
};

export const updateAuthCookies = (
  event: RequestEventCommon,
  session: Pick<Session, "refresh_token" | "expires_in" | "access_token">
) => {
  event.cookie.set(cookieName, session, options);
  // somehow cookie.set is not working right now
  event.headers.set("Set-Cookie", event.cookie.headers()[0]);
};

export const removeAuthCookies = (event: RequestEventCommon) => {
  event.cookie.delete(cookieName, options);
  // somehow cookie.delete is not working right now
  event.headers.set("Set-Cookie", event.cookie.headers()[0]);
};

export const getUserByCookie = async (event: RequestEventCommon) => {
  const value = event.cookie.get(cookieName)?.json();

  const parsed = z
    .object({ access_token: z.string(), refresh_token: z.string() })
    .safeParse(value);

  if (!parsed.success) {
    return null;
  }

  const supabase = createSupabase(event);

  const userResponse = await supabase.auth.getUser(parsed.data.access_token);

  if (userResponse.data.user) {
    return userResponse.data.user;
  }

  const refreshResponse = await supabase.auth.refreshSession({
    refresh_token: parsed.data.refresh_token,
  });

  if (!refreshResponse.data.session) {
    removeAuthCookies(event);
    return null;
  }

  const session = refreshResponse.data.session;
  updateAuthCookies(event, session);

  return session.user;
};
