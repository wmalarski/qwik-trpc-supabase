import { component$, PropFunction } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { DeletePostForm } from "./DeletePostForm/DeletePostForm";
import { UpdatePostForm } from "./UpdatePostForm/UpdatePostForm";

type Props = {
  onDeleteSuccess$: PropFunction<(postId: string) => void>;
  onUpdateSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const PostActions = component$<Props>((props) => {
  return (
    <div>
      <DeletePostForm post={props.post} onSuccess$={props.onDeleteSuccess$} />
      <UpdatePostForm post={props.post} onSuccess$={props.onUpdateSuccess$} />
    </div>
  );
});
