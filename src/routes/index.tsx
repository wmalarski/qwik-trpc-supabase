import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import type { User } from "@supabase/supabase-js";

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/supabase");

  const user = await getUserByCookie(ev.request);

  return user;
};

export default component$(() => {
  const user = useEndpoint<User>();

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <Resource
        value={user}
        onPending={() => <div>Loading...</div>}
        onResolved={(user) => <pre>{JSON.stringify(user, null, 2)}</pre>}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
