import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/CommentActions/CommentActions";
import { paths } from "~/utils/paths";

type Props = {
  comment: Comment;
};

export const CommentsListItem = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <Link class="link" href={paths.comment(props.comment.id)}>
        Show comments
      </Link>
      <CommentActions comment={props.comment} />
    </div>
  );
});
