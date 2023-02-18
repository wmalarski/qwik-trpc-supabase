import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/api";
import { PostCard } from "./PostCard/PostCard";

export const usePost = trpc.post.get.loader$((event) => {
  return { id: event.params.postId };
});

export const useComments = trpc.comment.listForPost.loader$((event) => {
  return { postId: event.params.postId, skip: 0, take: 10 };
});

export default component$(() => {
  const post = usePost();

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
