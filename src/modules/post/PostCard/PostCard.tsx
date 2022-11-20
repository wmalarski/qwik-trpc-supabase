import { component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { paths } from "~/utils/paths";
import { PostActions } from "../PostActions/PostActions";

type Props = {
  comments: Comment[];
  commentsCount: number;
  post: Post;
};

export const PostCard = component$((props: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions
        post={props.post}
        onDeleteSuccess$={() => {
          navigate.path = paths.board;
        }}
        onUpdateSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
      <CreateCommentForm
        parentId={null}
        postId={props.post.id}
        onSuccess$={() => {
          window.location.replace(location.pathname);
        }}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
