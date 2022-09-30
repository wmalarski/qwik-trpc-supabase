import { RequestHandler } from "@builder.io/qwik-city";
import { removeAuthCookies } from "~/server/supabase";

export const onGet: RequestHandler = async (ev) => {
  await removeAuthCookies(ev.response);

  return ev.response.redirect("/");
};
