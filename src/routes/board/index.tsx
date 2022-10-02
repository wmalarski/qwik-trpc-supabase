import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, RequestEvent, useEndpoint } from "@builder.io/qwik-city";
import { CreatePostForm } from "~/modules/post/CreatePostForm/CreatePostForm";
import { PostsList } from "~/modules/post/PostsList/PostsList";
import { paths } from "~/utils/paths";
import { InferPromise } from "~/utils/trpc";

export const onGet = async (ev: RequestEvent) => {
  const { serverCaller } = await import("~/server/trpc/router");

  const { caller, context } = await serverCaller(ev);

  if (!context.user) {
    throw ev.response.redirect(paths.signIn);
  }

  const posts = await caller.post.list({ skip: 0, take: 10 });

  return posts;
};

export default component$(() => {
  const resource = useEndpoint<InferPromise<typeof onGet>>();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => <PostsList posts={result.posts} />}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
