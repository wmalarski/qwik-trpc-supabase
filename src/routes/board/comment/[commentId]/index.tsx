import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { paths } from "~/utils/paths";
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

export const deleteComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;

  const comment = await trpc.comment.get({ id });

  await trpc.comment.delete({ id });

  const path = comment.parentId
    ? paths.comment(comment.parentId)
    : paths.post(comment.postId);

  event.redirect(302, path);
});

export const updateComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;
  const text = form.get("text") as string;

  await trpc.comment.update({ id, text });

  return trpc.comment.get({ id });
});

export const createComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const text = form.get("text") as string;
  const parentId = form.get("parentId") as string;
  const postId = form.get("postId") as string;

  return trpc.comment.create({
    parentId,
    postId,
    text,
  });
});

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
