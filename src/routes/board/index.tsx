import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/serverApi";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const usePostsLoader = trpc.post.list.loader$({
  skip: 0,
  take: 10,
});

export default component$(() => {
  const posts = usePostsLoader();

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
