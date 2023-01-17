import { component$, PropFunction } from "@builder.io/qwik";
import { loader$, useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { protectedTrpcProcedure } from "~/server/procedures";
import { paths } from "~/utils/paths";

export const getData = loader$(
  protectedTrpcProcedure.loader(({ trpc, params }) => {
    return trpc.comment.listForParent({
      parentId: params.commentId,
      skip: 0,
      take: 10,
    });
  })
);

type Props = {
  comment: Comment;
  onUpdateSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CommentCard = component$<Props>((props) => {
  const postId = props.comment.postId;

  const navigate = useNavigate();

  const resource = getData.use();

  const backPath = props.comment.parentId
    ? paths.comment(props.comment.parentId)
    : paths.post(props.comment.postId);

  return (
    <div>
      <a class="link" href={backPath}>
        Back
      </a>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CommentActions
        comment={props.comment}
        onDeleteSuccess$={() => {
          navigate(paths.post(postId));
        }}
        onUpdateSuccess$={props.onUpdateSuccess$}
      />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
        onSuccess$={(created) => {
          resource.value.comments.splice(0, 0, created);
          resource.value.count += 1;
        }}
      />
      <CommentsList
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
        comments={resource.value.comments}
        count={resource.value.count}
      />
    </div>
  );
});
