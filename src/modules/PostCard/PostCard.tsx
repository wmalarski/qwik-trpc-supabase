import { component$ } from "@builder.io/qwik";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "../CommentsList/CommentsList";

type Props = {
  comments: Comment[];
  commentsCount: number;
  post: Post;
};

export const PostCard = component$((props: Props) => {
  return (
    <div>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
