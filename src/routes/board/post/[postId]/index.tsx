import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { client } from "~/routes/plugin@trpc";
import { getTrpcFromEvent } from "~/server/trpc/caller";
import { paths } from "~/utils/paths";

// export const usePost = trpcRouteLoader$((event) => ({
//   args: { id: event.params.postId },
//   path: ["post", "get"],
// }));

// export const useComments = trpcRouteLoader$((event) => ({
//   args: { postId: event.params.postId, skip: 0, take: 10 },
//   path: ["comment", "listForPost"],
// }));

export const usePost = routeLoader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.post.get({ id: event.params.postId });
});

export const useComments = routeLoader$(async (event) => {
  const trpc = await getTrpcFromEvent(event);
  return trpc.comment.listForPost({
    postId: event.params.postId,
    skip: 0,
    take: 10,
  });
});

type PostCardProps = {
  post: Post;
};

export const PostCard = component$<PostCardProps>((props) => {
  const comments = useComments();

  const collection = useSignal<Comment[]>([]);
  const page = useSignal(0);

  useTask$(({ track }) => {
    const trackedComments = track(() => comments.value);
    collection.value = trackedComments.comments;
    page.value = 0;
  });

  return (
    <div>
      <Link class="link" href={paths.board}>
        Back
      </Link>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions post={props.post} />
      <CreateCommentForm parentId={null} postId={props.post.id} />
      <CommentsList comments={collection.value} count={comments.value.count} />
      <button
        class="btn"
        onClick$={async () => {
          const value = await client.comment.listForPost.query({
            postId: props.post.id,
            skip: (page.value + 1) * 10,
            take: 10,
          });
          const nextCollection = [...collection.value];
          nextCollection.push(...value.comments);
          collection.value = nextCollection;
          page.value += 1;
        }}
      >
        Load more
      </button>
    </div>
  );
});

export default component$(() => {
  const post = usePost();

  return (
    <div class="flex flex-col gap-2">
      <h1>Post</h1>
      <PostCard post={post.value} />
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
