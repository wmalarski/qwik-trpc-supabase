import { RequestHandler } from "@builder.io/qwik-city";
import { setAuthCookies } from "~/server/auth/auth";

export const onPost: RequestHandler = async ({ request, cookie }) => {
  await setAuthCookies(request, cookie);

  return null;
};
