import { component$ } from "@builder.io/qwik";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import type { Comment } from "~/server/db/types";
import { paths } from "~/utils/paths";
import { getComments } from "..";

type Props = {
  comment: Comment;
};

export const CommentCard = component$<Props>((props) => {
  const resource = getComments.use();

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
      <CommentsList
        comments={resource.value.comments}
        count={resource.value.count}
      />
    </div>
  );
});
