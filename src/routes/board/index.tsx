import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/api";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const usePosts = routeLoader$((event) =>
  trpc.post.list.loader(event, { skip: 0, take: 10 })
);

export default component$(() => {
  const posts = usePosts();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      {posts.value.status === "success" ? (
        <PostsList posts={posts.value.result.posts} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
