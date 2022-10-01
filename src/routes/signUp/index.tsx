import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { RegisterForm } from "~/modules/RegisterForm/RegisterForm";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/supabase");

  const user = await getUserByCookie(ev.request);

  if (user) {
    throw ev.response.redirect(paths.board);
  }

  return;
};

export default component$(() => {
  useEndpoint();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>

      <RegisterForm />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Sign Up - Welcome to Qwik",
};
