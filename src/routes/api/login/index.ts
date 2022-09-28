import { RequestHandler } from "@builder.io/qwik-city";
import { getAuthCookieString } from "~/server/supabase";

export const onPost: RequestHandler = async (ev) => {
  await getAuthCookieString(ev.request, ev.response);

  return null;
};
