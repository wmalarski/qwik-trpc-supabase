import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { paths } from "~/utils/paths";
import { CommentsList } from "../CommentsList/CommentsList";
import { CreateCommentForm } from "../CreateCommentForm/CreateCommentForm";

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
