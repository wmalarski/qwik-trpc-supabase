import { component$ } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";
import { createComment, deleteComment, getComments, updateComment } from "..";

type Props = {
  comment: Comment;
};

export const CommentCard = component$<Props>((props) => {
  const resource = getComments.use();

  const deleteCommentAction = deleteComment.use();
  const updateCommentAction = updateComment.use();
  const createCommentAction = createComment.use();

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
        deleteCommentAction={deleteCommentAction}
        updateCommentAction={updateCommentAction}
      />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
        action={createCommentAction}
      />
      <CommentsList
        deleteCommentAction={deleteCommentAction}
        updateCommentAction={updateCommentAction}
        comments={resource.value.comments}
        count={resource.value.count}
      />
    </div>
  );
});
