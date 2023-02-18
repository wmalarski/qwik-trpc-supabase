import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { PostCard } from "./PostCard/PostCard";

export const usePostLoader = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.post.get({ id: event.params.postId });
});

export const useCommentsLoader = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.listForPost({
    postId: event.params.postId,
    skip: 0,
    take: 10,
  });
});

export default component$(() => {
  const post = usePostLoader();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <PostCard
        post={post.value}
        onUpdateSuccess$={() => {
          // resource.value = post;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
