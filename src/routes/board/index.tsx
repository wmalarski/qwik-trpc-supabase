import { component$ } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { trpcAction } from "~/server/trpc/action";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  const result = await trpc.post.list({ skip: 0, take: 10 });
  return result;
});

export const deletePost = action$((data, event) => trpcAction(data, event));

export const updatePost = action$((data, event) => trpcAction(data, event));

export const createPost = action$((data, event) => trpcAction(data, event));

export default component$(() => {
  const resource = getData.use();

  const createPostAction = createPost.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm action={createPostAction} />
      <PostsList posts={resource.value.posts} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
