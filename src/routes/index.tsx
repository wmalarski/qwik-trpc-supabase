import { component$, Resource } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import type { User } from "@supabase/supabase-js";
import { ProtectedHeader } from "~/modules/ProtectedHeader/ProtectedHeader";
import { PublicHeader } from "~/modules/PublicHeader/PublicHeader";

export const onGet: RequestHandler = async (ev) => {
  const { getUserByCookie } = await import("~/server/auth");

  const user = await getUserByCookie(ev.request);

  return user;
};

export default component$(() => {
  const user = useEndpoint<User>();

  return (
    <Resource
      value={user}
      onPending={() => <div>Loading...</div>}
      onRejected={() => <div>Rejected</div>}
      onResolved={(user) => (
        <div class="flex flex-col">
          {user ? <ProtectedHeader /> : <PublicHeader />}
          <section class="border-b-8 border-solid border-primary p-5">
            <h1>
              Welcome to Qwik <span>⚡️</span>
            </h1>
            {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
          </section>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
