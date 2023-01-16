import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { withUser } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { RegisterForm } from "./RegisterForm/RegisterForm";

export const onPost = endpointBuilder()
  .use(withUser())
  .use(withTrpc())
  .resolver(async ({ request, supabase, redirect }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const result = await supabase.auth.signUp({
      email,
      options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
      password,
    });

    if (result.error) {
      return result;
    }

    throw redirect(302, paths.signIn);
  });

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver(({ user, redirect }) => {
    if (user) {
      throw redirect(302, paths.index);
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
