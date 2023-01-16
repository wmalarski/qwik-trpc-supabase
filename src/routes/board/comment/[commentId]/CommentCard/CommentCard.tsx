import { component$, PropFunction } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";

type Props = {
  comments: Comment[];
  commentsCount: number;
  comment: Comment;
  onUpdateSuccess$: PropFunction<(comment: Comment) => void>;
  onCreateSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CommentCard = component$<Props>((props) => {
  const postId = props.comment.postId;

  const navigate = useNavigate();

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
        onSuccess$={props.onCreateSuccess$}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
