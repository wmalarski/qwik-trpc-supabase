import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { trpcAction } from "~/server/trpc/action";
import { CommentCard } from "./CommentCard/CommentCard";

export const getData = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.get({ id: event.params.commentId });
});

export const getComments = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.listForParent({
    parentId: event.params.commentId,
    skip: 0,
    take: 10,
  });
});

export const deleteComment = action$(trpcAction);
export const updateComment = action$(trpcAction);
export const createComment = action$(trpcAction);

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => <CommentCard comment={result} />}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
