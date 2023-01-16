import { component$, Resource } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(
  endpointBuilder()
    .use(withProtected())
    .use(withTrpc())
    .loader(async ({ trpc }) => {
      const posts = await trpc.post.list({ skip: 0, take: 10 });
      return posts;
    })
);

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm
        onSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
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
