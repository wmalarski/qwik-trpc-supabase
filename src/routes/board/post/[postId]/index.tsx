import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { trpcAction } from "~/server/trpc/action";
import { PostCard } from "./PostCard/PostCard";

export const getData = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.post.get({ id: event.params.postId });
});

export const getComments = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.listForPost({
    postId: event.params.postId,
    skip: 0,
    take: 10,
  });
});

export const deleteComment = action$(trpcAction);
export const updateComment = action$(trpcAction);
export const createComment = action$(trpcAction);
export const updatePost = action$(trpcAction);
export const deletePost = action$(trpcAction);

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <PostCard
        post={resource.value}
        onUpdateSuccess$={(post) => {
          resource.value = post;
        }}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
