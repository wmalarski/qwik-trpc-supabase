import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { paths } from "~/utils/paths";
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

export const deleteComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;
  await trpc.comment.delete({ id });
});

export const updateComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;
  const text = form.get("text") as string;

  await trpc.comment.update({ id, text });
});

export const createComment = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const text = form.get("text") as string;
  const parentId = form.get("parentId") as string;
  const postId = form.get("postId") as string;

  const comment = await trpc.comment.create({
    parentId,
    postId,
    text,
  });

  throw event.redirect(302, paths.comment(comment.id));
});

export const updatePost = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;
  const content = form.get("content") as string;

  await trpc.post.update({ content, id });
});

export const deletePost = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;

  await trpc.post.delete({ id });

  throw event.redirect(302, paths.board);
});

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => (
          <PostCard
            post={result}
            onUpdateSuccess$={(post) => {
              resource.value = post;
            }}
          />
        )}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
