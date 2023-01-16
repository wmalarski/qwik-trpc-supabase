import { component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";

type Props = {
  comments: Comment[];
  commentsCount: number;
  comment: Comment;
};

export const CommentCard = component$<Props>((props) => {
  const postId = props.comment.postId;

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;

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
        onUpdateSuccess$={() => {
          window.location.replace(pathname);
        }}
      />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
        onSuccess$={() => {
          window.location.replace(pathname);
        }}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
