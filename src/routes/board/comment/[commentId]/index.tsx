import { component$ } from "@builder.io/qwik";
import { DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/serverApi";
import { CommentCard } from "./CommentCard/CommentCard";

export const useCommentLoader = trpc.comment.get.loader$((event) => {
  return { id: event.params.commentId };
});

export const useCommentsLoader = trpc.comment.listForParent.loader$((event) => {
  return { parentId: event.params.commentId, skip: 0, take: 10 };
});

export default component$(() => {
  const comment = useCommentLoader();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      {comment.value.status === "success" ? (
        <CommentCard comment={comment.value.result} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
