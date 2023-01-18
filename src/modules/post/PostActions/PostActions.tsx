import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";
import { DeletePostForm } from "./DeletePostForm/DeletePostForm";
import { UpdatePostForm } from "./UpdatePostForm/UpdatePostForm";

type Props = {
  deletePostAction: FormProps<void>["action"];
  updatePostAction: FormProps<void>["action"];
  post: Post;
};

export const PostActions = component$<Props>((props) => {
  return (
    <div>
      <DeletePostForm post={props.post} action={props.deletePostAction} />
      <UpdatePostForm post={props.post} action={props.updatePostAction} />
    </div>
  );
});
