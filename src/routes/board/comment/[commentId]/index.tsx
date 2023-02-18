import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { CommentCard } from "./CommentCard/CommentCard";

export const useCommentLoader = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.get({ id: event.params.commentId });
});

export const useCommentsLoader = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.listForParent({
    parentId: event.params.commentId,
    skip: 0,
    take: 10,
  });
});

export default component$(() => {
  const comment = useCommentLoader();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      <CommentCard comment={comment.value} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
