import type { RequestEventLoader } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";

export const withUser = <
  R extends RequestEventLoader = RequestEventLoader
>() => {
  return async (event: R) => {
    const { getUserByCookie, supabase } = await import("./auth");

    const result = await getUserByCookie(event.cookie);

    return { ...event, supabase, user: result?.user || null };
  };
};

type WithProtectedOptions = {
  redirectTo?: string;
};

export const withProtected = <
  R extends RequestEventLoader = RequestEventLoader
>(
  options: WithProtectedOptions = {}
) => {
  return async (event: R) => {
    const { getUserByCookie, supabase } = await import("./auth");

    const result = await getUserByCookie(event.cookie);

    if (!result?.user) {
      throw event.redirect(302, options.redirectTo || paths.signIn);
    }
    return { ...event, supabase, user: result.user };
  };
};
