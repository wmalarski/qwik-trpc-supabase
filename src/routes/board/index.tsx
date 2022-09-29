import { component$, Resource, useResource$, useStore } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/utils/trpc";

export default component$(() => {
  const store = useStore({ limit: 50, skip: 0 });

  const resource = useResource$<string>(async ({ track, cleanup }) => {
    const limit = track(store, "limit");
    const skip = track(store, "skip");

    const abortController = new AbortController();
    cleanup(() => abortController.abort("cleanup"));

    console.log({ limit, skip });

    const posts = await trpc.post.posts.query(
      { limit, skip },
      { signal: abortController.signal }
    );

    console.log({ posts });

    return posts;
  });

  return (
    <div>
      <h1>
        Welcome to Qwik <span class="lightning">⚡️</span>
      </h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(weather) => {
          return <div>Temperature: {weather}</div>;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
};
