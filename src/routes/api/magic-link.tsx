import { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = (ev) => {
  console.log("magic-link", ev);
  return null;
};
