import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  type DocumentHead,
} from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { trpc } from "~/server/trpc/api";
import { paths } from "~/utils/paths";

export const usePost = routeLoader$((event) =>
  trpc.post.get.loader(event, { id: event.params.postId })
);

export const useComments = routeLoader$((event) =>
  trpc.comment.listForPost.loader(event, {
    postId: event.params.postId,
    skip: 0,
    take: 10,
  })
);

const queryMoreComments = server$(trpc.comment.listForPost.query());

type PostCardProps = {
  post: Post;
};

export const PostCard = component$<PostCardProps>((props) => {
  const comments = useComments();

  const collection = useSignal<Comment[]>([]);
  const page = useSignal(0);

  useTask$(() => {
    if (comments.value.status === "success") {
      collection.value = comments.value.result.comments;
      page.value = 0;
    }
  });

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions post={props.post} />
      <CreateCommentForm parentId={null} postId={props.post.id} />
      {comments.value.status === "success" ? (
        <CommentsList
          comments={comments.value.result.comments}
          count={comments.value.result.count}
        />
      ) : null}
      <button
        class="btn"
        onClick$={async () => {
          const value = await queryMoreComments({
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
      {post.value.status === "success" ? (
        <PostCard post={post.value.result} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
