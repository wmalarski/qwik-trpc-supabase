import { RequestHandler } from "@builder.io/qwik-city";
import { setAuthCookies } from "~/server/auth";

export const onPost: RequestHandler = async (ev) => {
  await setAuthCookies(ev.request, ev.response);

  return null;
};
