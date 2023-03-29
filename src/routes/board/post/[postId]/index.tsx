import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { trpcFetch, trpcRouteLoader$ } from "~/routes/plugin@trpc";
import { paths } from "~/utils/paths";

export const usePost = trpcRouteLoader$((trpc, event) =>
  trpc.post.get({ id: event.params.postId })
);

export const useComments = trpcRouteLoader$((trpc, event) =>
  trpc.comment.listForPost({ postId: event.params.postId, skip: 0, take: 10 })
);

type PostCardProps = {
  post: Post;
};

export const PostCard = component$<PostCardProps>((props) => {
  const comments = useComments();

  const collection = useSignal<Comment[]>([]);
  const page = useSignal(0);

  useTask$(({ track }) => {
    const trackedComments = track(() => comments.value);
    if (trackedComments.status === "success") {
      collection.value = trackedComments.result.comments;
      page.value = 0;
    }
  });

  return (
    <div>
      <Link class="link" href={paths.board}>
        Back
      </Link>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions post={props.post} />
      <CreateCommentForm parentId={null} postId={props.post.id} />
      {comments.value.status === "success" ? (
        <CommentsList
          comments={collection.value}
          count={comments.value.result.count}
        />
      ) : null}
      <button
        class="btn"
        onClick$={async () => {
          const value = await trpcFetch((trpc) => trpc.comment.listForPost())({
            postId: props.post.id,
            skip: (page.value + 1) * 10,
            take: 10,
          });
          if (value.status === "success") {
            const nextCollection = [...collection.value];
            nextCollection.push(...value.result.comments);
            collection.value = nextCollection;
            page.value += 1;
          }
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
      {post.value.status === "success" ? (
        <PostCard post={post.value.result} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
