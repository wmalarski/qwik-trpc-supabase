import { component$, Resource, useStore } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { CreatePostForm } from "~/modules/CreatePostForm/CreatePostForm";
import { PostsList } from "~/modules/PostsList/PostsList";
import { paths } from "~/utils/paths";
import { InferProcedures } from "~/utils/trpc";

export const onGet = async (ev: RequestEvent) => {
  const { serverCaller } = await import("~/server/trpc/router");

  const { caller, context } = await serverCaller(ev);

  if (!context.user) {
    throw ev.response.redirect(paths.signIn);
  }

  const posts = await caller.post.posts({ skip: 0, take: 10 });

  return posts;
};

export default component$(() => {
  const resource = useEndpoint<InferProcedures["post"]["posts"]["output"]>();

  const store = useStore({ limit: 50, skip: 0 });

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => <PostsList posts={result.posts} />}
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
  title: "Board - Welcome to Qwik",
};
