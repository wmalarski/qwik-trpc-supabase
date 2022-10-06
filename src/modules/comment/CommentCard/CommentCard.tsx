import { component$ } from "@builder.io/qwik";
import { Link, useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { paths } from "~/utils/paths";
import { CommentActions } from "../CommentActions/CommentActions";
import { CommentsList } from "../CommentsList/CommentsList";
import { CreateCommentForm } from "../CreateCommentForm/CreateCommentForm";

type Props = {
  comments: Comment[];
  commentsCount: number;
  comment: Comment;
};

export const CommentCard = component$((props: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const backPath = props.comment.parentId
    ? paths.comment(props.comment.parentId)
    : paths.post(props.comment.postId);

  return (
    <div>
      <Link class="link" href={backPath}>
        Back
      </Link>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CommentActions
        comment={props.comment}
        onDeleteSuccess$={() => {
          navigate.path = paths.post(props.comment.postId);
        }}
        onUpdateSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
        onSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
