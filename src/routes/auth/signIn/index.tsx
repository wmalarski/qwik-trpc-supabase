import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { withUser } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { getBaseUrl } from "~/utils/getBaseUrl";
import { paths } from "~/utils/paths";
import { Login } from "./Login/Login";

export const onPost = endpointBuilder()
  .use(withUser())
  .use(withTrpc())
  .resolver(async ({ request, supabase, cookie, redirect }) => {
    const form = await request.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string | undefined;

    if (!password) {
      const otpResult = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${getBaseUrl()}${paths.callback}` },
      });
      return { otpError: otpResult.error, otpSuccess: !otpResult.error };
    }

    const result = await supabase.auth.signInWithPassword({ email, password });
    if (result.error || !result.data.session) {
      return { passError: result.error };
    }

    const { updateAuthCookies } = await import("~/server/auth/auth");
    updateAuthCookies(result.data.session, cookie);

    throw redirect(302, paths.board);
  });

export const onGet = endpointBuilder()
  .use(withUser())
  .resolver((ev) => {
    if (ev.user) {
      throw ev.redirect(302, paths.index);
    }
  });

export default component$(() => {
  const resource = useEndpoint<typeof onPost>();

  return (
    <Resource
      value={resource}
      onResolved={(data) => (
        <Login
          passError={data?.passError}
          otpError={data?.otpError}
          otpIsSuccess={data?.otpSuccess}
        />
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Sign In - Welcome to Qwik",
};
