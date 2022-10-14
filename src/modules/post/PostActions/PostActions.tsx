import { component$, PropFunction } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { DeletePostForm } from "./DeletePostForm/DeletePostForm";
import { UpdatePostForm } from "./UpdatePostForm/UpdatePostForm";

type Props = {
  onDeleteSuccess$?: PropFunction<() => void>;
  onUpdateSuccess$?: PropFunction<() => void>;
  post: Post;
};

export const PostActions = component$((props: Props) => {
  return (
    <div>
      <DeletePostForm post={props.post} onSuccess$={props.onDeleteSuccess$} />
      <UpdatePostForm post={props.post} onSuccess$={props.onUpdateSuccess$} />
    </div>
  );
});
