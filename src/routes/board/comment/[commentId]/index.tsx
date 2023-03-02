import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import { trpc } from "~/server/trpc/api";
import { CommentCard } from "./CommentCard/CommentCard";

export const useComment = routeLoader$((event) =>
  trpc.comment.get.loader(event, { id: event.params.commentId })
);

export const useComments = routeLoader$((event) =>
  trpc.comment.listForParent.loader(event, {
    parentId: event.params.commentId,
    skip: 0,
    take: 10,
  })
);

export default component$(() => {
  const comment = useComment();

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
