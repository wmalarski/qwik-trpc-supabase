import { component$ } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { DeletePostForm } from "./DeletePostForm/DeletePostForm";
import { UpdatePostForm } from "./UpdatePostForm/UpdatePostForm";

type Props = {
  post: Post;
};

export const PostActions = component$<Props>((props) => {
  return (
    <div>
      <DeletePostForm post={props.post} />
      <UpdatePostForm post={props.post} />
    </div>
  );
});
