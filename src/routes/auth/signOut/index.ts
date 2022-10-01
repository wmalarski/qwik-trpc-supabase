import { RequestHandler } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/supabase";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
  await removeAuthCookies(ev.response);

  throw ev.response.redirect(paths.index);
};
