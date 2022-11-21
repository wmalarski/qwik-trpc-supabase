import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, useEndpoint } from "@builder.io/qwik-city";
import { withUser } from "~/server/auth/withUser";
import { serverEnv } from "~/server/serverEnv";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const onPost = endpointBuilder()
  .use(withUser())
  .use(withTrpc())
  .resolver(async ({ request, response, supabase }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await supabase.auth.signUp({
      email,
      // TODO: replace with calculated url
      options: { emailRedirectTo: serverEnv.VITE_REDIRECT_URL },
      password,
    });

    if (result.error) {
      return result;
    }

    throw response.redirect(paths.signIn);
  });

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver(({ user, response }) => {
    if (user) {
      throw response.redirect(paths.index);
    }
  });

export default component$(() => {
  const resource = useEndpoint<typeof onPost>();

  return (
    <div class="flex flex-col gap-2">
      <h1>Sign Up</h1>
      <Resource
        value={resource}
        onResolved={(data) => <RegisterForm error={data?.error} />}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
