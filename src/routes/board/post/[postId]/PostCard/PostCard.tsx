import { component$ } from "@builder.io/qwik";
import { useLocation, useNavigate } from "@builder.io/qwik-city";
import type { Comment, Post } from "@prisma/client";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { PostActions } from "~/modules/post/PostActions/PostActions";
import { paths } from "~/utils/paths";

type Props = {
  comments: Comment[];
  commentsCount: number;
  post: Post;
};

export const PostCard = component$<Props>((props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div>
      <a class="link" href={paths.board}>
        Back
      </a>
      <pre>{JSON.stringify(props.post, null, 2)}</pre>
      <PostActions
        post={props.post}
        onDeleteSuccess$={() => {
          navigate(paths.board);
        }}
        onUpdateSuccess$={() => {
          window.location.replace(pathname);
        }}
      />
      <CreateCommentForm
        parentId={null}
        postId={props.post.id}
        onSuccess$={() => {
          window.location.replace(pathname);
        }}
      />
      <CommentsList comments={props.comments} count={props.commentsCount} />
    </div>
  );
});
