import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { paths } from "~/utils/paths";
import { CommentsList } from "../CommentsList/CommentsList";
import { CreateCommentForm } from "../CreateCommentForm/CreateCommentForm";

type Props = {
  comments: Comment[];
  commentsCount: number;
  comment: Comment;
};

export const CommentCard = component$((props: Props) => {
  return (
    <div>
      <Link
        class="link"
        href={
          props.comment.parentId
            ? paths.comment(props.comment.parentId)
            : paths.post(props.comment.postId)
        }
      >
        Back
      </Link>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
