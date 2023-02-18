import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/api";
import { PostCard } from "./PostCard/PostCard";

export const usePost = loader$((event) =>
  trpc.post.get.loader(event, { id: event.params.postId })
);

export const useComments = loader$((event) =>
  trpc.comment.listForPost.loader(event, {
    postId: event.params.postId,
    skip: 0,
    take: 10,
  })
);

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
