import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { ProtectedHeader } from "~/modules/layout/ProtectedHeader/ProtectedHeader";
import { PublicHeader } from "~/modules/layout/PublicHeader/PublicHeader";
import { withUser } from "~/server/auth/withUser";
import { endpointBuilder } from "~/utils/endpointBuilder";

export const getData = loader$(
  endpointBuilder()
    .use(withUser())
    .loader(({ user }) => {
      return user;
    })
);

export default component$(() => {
  const user = getData.use();

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
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </section>
        </div>
      )}
    />
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
