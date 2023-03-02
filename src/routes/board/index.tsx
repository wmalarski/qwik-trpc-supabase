import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { trpc } from "~/server/trpc/api";
import { paths } from "~/utils/paths";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";

export const usePosts = routeLoader$((event) =>
  trpc.post.list.loader(event, { skip: 0, take: 10 })
);

type PostListItemProps = {
  post: Post;
};

export const PostListItem = component$<PostListItemProps>((props) => {
  return (
    <div class="card card-bordered card-compact overflow-visible">
      <div class="card-body">
        <pre>{JSON.stringify(props.post, null, 2)}</pre>
        <div class="card-actions">
          <a class="btn btn-link btn-sm" href={paths.post(props.post.id)}>
            Show comments
          </a>
          <PostActions post={props.post} />
        </div>
      </div>
    </div>
  );
});

export default component$(() => {
  const posts = usePosts();

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      {posts.value.status === "success" ? (
        <div class="flex flex-col gap-4">
          {posts.value.result.posts.map((post) => (
            <PostListItem key={post.id} post={post} />
          ))}
        </div>
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
