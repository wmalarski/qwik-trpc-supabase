import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  Link,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import type { User } from "@supabase/supabase-js";
import { MagicLinkForm } from "~/modules/MagicLinkForm/MagicLinkForm";
import { getUserByCookie } from "~/server/supabase";

export const onGet: RequestHandler = async (ev) => {
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
      <Link href="/board">Board</Link>
      <MagicLinkForm />
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
