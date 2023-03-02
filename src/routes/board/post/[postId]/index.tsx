import { component$ } from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
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

type PostCardProps = {
  post: Post;
};

export const PostCard = component$<PostCardProps>((props) => {
  const comments = useComments();

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
