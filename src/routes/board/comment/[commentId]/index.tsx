import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
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

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      <CommentCard comment={resource.value} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
