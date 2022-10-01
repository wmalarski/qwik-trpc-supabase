import { component$, Resource, useStore } from "@builder.io/qwik";
import {
  DocumentHead,
  RequestHandler,
  useEndpoint,
} from "@builder.io/qwik-city";
import { CreatePostForm } from "~/modules/CreatePostForm/CreatePostForm";
import { paths } from "~/utils/paths";

export const onGet: RequestHandler = async (ev) => {
  const { serverCaller } = await import("~/server/trpc/router");

  const { caller, context } = await serverCaller(ev);

  if (!context.user) {
    throw ev.response.redirect(paths.signIn);
  }

  const posts = await caller.post.posts({ limit: 10, skip: 0 });

  return posts;
};

export default component$(() => {
  const resource = useEndpoint<string>();

  const store = useStore({ limit: 50, skip: 0 });

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <CreatePostForm />
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(weather) => {
          return <pre>{JSON.stringify(weather, null, 2)}</pre>;
        }}
      />
      <button class="btn" onClick$={() => (store.skip -= store.limit)}>
        -
      </button>
      <button class="btn" onClick$={() => (store.skip += store.limit)}>
        +
      </button>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
