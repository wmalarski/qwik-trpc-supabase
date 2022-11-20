import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { z } from "zod";
import { withUser } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const onPost = endpointBuilder()
  .use(withUser())
  .use(withTrpc())
  .resolver(async ({ request, response, supabase }) => {
    const { updateAuthCookies } = await import("~/server/auth/auth");

    const json = await request.json();

    const formSchema = z.object({
      email: z.string().email(),
      password: z.string(),
    });

    const args = formSchema.parse(json);

    const result = await supabase.auth.signInWithPassword(args);

    if (result.error || !result.data.session) {
      throw new Error(result.error?.message || "INVALID_INPUT");
    }

    updateAuthCookies(result.data.session, response);

    return null;
  });

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver(({ user, response }) => {
    if (user) {
      throw response.redirect(paths.index);
    }
  });

export default component$(() => {
  return (
    <div class="flex flex-col gap-2">
      <h1>Sign Up</h1>
      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
