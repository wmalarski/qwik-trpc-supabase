import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";
import { useComments } from "..";

type Props = {
  comment: Comment;
};

export const CommentCard = component$<Props>((props) => {
  const comments = useComments();

  const backPath = props.comment.parentId
    ? paths.comment(props.comment.parentId)
    : paths.post(props.comment.postId);

  return (
    <div>
      <a class="link" href={backPath}>
        Back
      </a>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CommentActions comment={props.comment} />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
      />
      {comments.value.status === "success" ? (
        <CommentsList
          comments={comments.value.result.comments}
          count={comments.value.result.count}
        />
      ) : null}
    </div>
  );
});
