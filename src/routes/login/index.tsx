import { component$ } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { Login } from "~/modules/Login/Login";
import { getUserByCookie } from "~/server/supabase";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
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

      <Login />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Login - Welcome to Qwik",
};
