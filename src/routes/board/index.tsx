import { component$, Resource } from "@builder.io/qwik";
import { action$, DocumentHead, loader$ } from "@builder.io/qwik-city";
import { paths } from "~/utils/paths";
import { getUser } from "../layout";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";
import { getTrpc } from "./layout";
import { PostsList } from "./PostsList/PostsList";

export const getData = loader$(async (event) => {
  console.log("getData", event.url.href);
  const user = await event.getData(getUser);

  console.log("getData", event.url.href, { user });

  const trpc = await event.getData(getTrpc);

  console.log("getData", event.url.href, { trpc });

  return trpc?.post.list({ skip: 0, take: 10 });
});

export const deletePost = action$(async (form, event) => {
  const trpc = await event.getData(getTrpc);
  const id = form.get("id") as string;

  await trpc.post.delete({ id });

  throw event.redirect(302, paths.board);
});

export const updatePost = action$(async (form, event) => {
  const trpc = await event.getData(getTrpc);
  const id = form.get("id") as string;
  const content = form.get("content") as string;

  await trpc.post.update({ content, id });
});

export const createPost = action$(async (form, event) => {
  const trpc = await event.getData(getTrpc);
  const content = form.get("content") as string;

  const comment = await trpc.post.create({ content });

  throw event.redirect(302, paths.comment(comment.id));
});

export default component$(() => {
  const resource = getData.use();

  const createPostAction = createPost.use();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
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
