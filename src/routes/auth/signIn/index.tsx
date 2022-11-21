import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import type { AuthResponse } from "@supabase/supabase-js";
import { z } from "zod";
import { withUser } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { Login } from "./Login/Login";

export const onPost = endpointBuilder()
  .use(withUser())
  .use(withTrpc())
  .resolver(async ({ request, response, supabase }) => {
    const form = await request.formData();
    const rawArgs = Object.fromEntries(form.entries());

    const formSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const parsed = formSchema.safeParse(rawArgs);
    if (!parsed.success) {
      throw response.error(403);
    }

    const result = await supabase.auth.signInWithPassword(parsed.data);
    if (result.error || !result.data.session) {
      return result;
    }

    const { updateAuthCookies } = await import("~/server/auth/auth");
    updateAuthCookies(result.data.session, response);

    throw response.redirect(paths.board);
  });

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver((ev) => {
    if (ev.user) {
      throw ev.response.redirect(paths.index);
    }
  });

export default component$(() => {
  const endpoint = useEndpoint<AuthResponse | null>();

  return (
    <>
      <Resource
        value={endpoint}
        onResolved={(data) => <Login error={data?.error} />}
      />
    </>
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
