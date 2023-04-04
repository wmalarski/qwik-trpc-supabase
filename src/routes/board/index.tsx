import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { trpc } from "~/routes/plugin@trpc";
import { paths } from "~/utils/paths";
import { CreatePostForm } from "./CreatePostForm/CreatePostForm";

// export const usePosts = trpcRouteLoader$(() => ({
//   args: { skip: 0, take: 10 },
//   path: ["post", "list"],
// }));

// export const useCreatePostAction = trpcGlobalAction((trpc) =>
//   trpc.post.create()
// );

export const usePosts = routeLoader$((event) => {
  return trpc.post.list.loader(event, { skip: 0, take: 10 });
});

export const useCreatePostAction = trpc.post.create.globalAction$();

type PostListItemProps = {
  post: Post;
};

export const PostListItem = component$<PostListItemProps>((props) => {
  return (
    <div class="card card-bordered card-compact overflow-visible">
      <div class="card-body">
        <pre>{JSON.stringify(props.post, null, 2)}</pre>
        <div class="card-actions">
          <Link class="btn btn-link btn-sm" href={paths.post(props.post.id)}>
            Show comments
          </Link>
          <PostActions post={props.post} />
        </div>
      </div>
    </div>
  );
});

export default component$(() => {
  const posts = usePosts();

  const collection = useSignal<Post[]>([]);
  const page = useSignal(0);

  useTask$(({ track }) => {
    const trackedPosts = track(() => posts.value);
    if (trackedPosts.status === "success") {
      collection.value = trackedPosts.result.posts;
      page.value = 0;
    }
  });

  return (
    <div class="flex flex-col gap-2">
      <h1>Feed</h1>
      <CreatePostForm />
      <div class="flex flex-col gap-4">
        {collection.value.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
        <button
          class="btn"
          onClick$={async () => {
            const value = await trpc.post.list.query({
              skip: (page.value + 1) * 10,
              take: 10,
            });
            if (value.status === "success") {
              const nextCollection = [...collection.value];
              nextCollection.push(...value.result.posts);
              collection.value = nextCollection;
              page.value += 1;
            }
          }}
        >
          Load more
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
