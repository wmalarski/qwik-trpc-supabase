import { component$ } from "@builder.io/qwik";
import { DocumentHead, loader$ } from "@builder.io/qwik-city";
import { getTrpcFromEvent } from "~/server/loaders";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  const result = await trpc.post.list({ skip: 0, take: 10 });
  return result;
});

export default component$(() => {
  const resource = getData.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      <PostsList posts={resource.value.posts} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
