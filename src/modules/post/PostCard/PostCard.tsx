import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";

type Props = {
  comments: Comment[];
  commentsCount: number;
  post: Post;
};

export const PostCard = component$((props: Props) => {
  return (
    <div>
      <Link class="link" href={paths.board}>
        Back
      </Link>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <CreateCommentForm parentId={null} postId={props.post.id} />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
