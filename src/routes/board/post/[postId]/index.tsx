import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/serverApi";
import { PostCard } from "./PostCard/PostCard";

export const usePostLoader = trpc.post.get.loader$((event) => {
  return { id: event.params.postId };
});

export const useCommentsLoader = trpc.comment.listForPost.loader$((event) => {
  return { postId: event.params.postId, skip: 0, take: 10 };
});

export default component$(() => {
  const post = usePostLoader();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      {post.value.status === "success" ? (
        <PostCard post={post.value.result} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
