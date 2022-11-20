import { RequestEvent } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";

export const withUser = <R extends RequestEvent = RequestEvent>() => {
  return async (event: R) => {
    const { getUserByCookie, supabase } = await import("./auth");

    const result = await getUserByCookie(event.request);

    return { ...event, supabase, user: result?.user || null };
  };
};

type WithProtectedOptions = {
  redirectTo?: string;
};

export const withProtected = <R extends RequestEvent = RequestEvent>(
  options: WithProtectedOptions = {}
) => {
  return async (event: R) => {
    const { getUserByCookie, supabase } = await import("./auth");

    const result = await getUserByCookie(event.request);

    if (!result?.user) {
      throw event.response.redirect(options.redirectTo || paths.signIn);
    }
    return { ...event, supabase, user: result.user };
  };
};
