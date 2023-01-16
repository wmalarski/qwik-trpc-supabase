import { component$, PropFunction } from "@builder.io/qwik";
import { loader$, useNavigate } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { withProtected } from "~/server/auth/withUser";
import { withTrpc } from "~/server/trpc/withTrpc";
import { endpointBuilder } from "~/utils/endpointBuilder";
import { paths } from "~/utils/paths";

export const getData = loader$(
  endpointBuilder()
    .use(withProtected())
    .use(withTrpc())
    .loader(({ trpc, params }) => {
      return trpc.comment.listForPost({
        postId: params.postId,
        skip: 0,
        take: 10,
      });
    })
);

type Props = {
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const PostCard = component$<Props>((props) => {
  const navigate = useNavigate();

  const resource = getData.use();

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions
        post={props.post}
        onDeleteSuccess$={() => {
          navigate(paths.board);
        }}
        onUpdateSuccess$={props.onUpdateSuccess$}
      />
      <CreateCommentForm
        parentId={null}
        postId={props.post.id}
        onSuccess$={(comment) => {
          navigate(paths.comment(comment.id));
        }}
      />
      <CommentsList
        comments={resource.value.comments}
        count={resource.value.count}
        onDeleteSuccess$={(commentId) => {
          const comments = resource.value.comments;
          const index = comments.findIndex((entry) => entry.id === commentId);
          resource.value.comments.splice(index, 1);
          resource.value.count -= 1;
        }}
        onUpdateSuccess$={(comment) => {
          const comments = resource.value.comments;
          const index = comments.findIndex((entry) => entry.id === comment.id);
          resource.value.comments.splice(index, 1, comment);
        }}
      />
    </div>
  );
});
