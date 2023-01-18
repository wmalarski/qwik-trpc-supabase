import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { trpcAction } from "~/server/trpc/action";
import { useTinyTrpc } from "~/utils/tinyTrpc";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  const result = await trpc.post.list({ skip: 0, take: 10 });
  return result;
});

export const deletePost = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;

  await trpc.post.delete({ id });
});

export const updatePost = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const id = form.get("id") as string;
  const content = form.get("content") as string;

  await trpc.post.update({ content, id });
});

export const createPost = action$(async (form, event) => {
  const trpc = await getTrpcFromEvent(event);
  const content = form.get("content") as string;

  await trpc.post.create({ content });
});

export const yolo = action$(trpcAction);

export default component$(() => {
  const resource = getData.use();

  const createPostAction = createPost.use();

  const yl = yolo.use();
  const yoloAction = useTinyTrpc();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <button
        onClick$={async () => {
          const trpc = await yoloAction();
          await trpc().post.create.mutate(yl, {
            content: "Crazy hack",
          });
        }}
      >
        YOLO
      </button>
      <CreatePostForm action={createPostAction} />
      <Resource
        value={resource}
        onPending={() => <div>Loading...</div>}
        onResolved={(result) => <PostsList posts={result.posts} />}
      />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
