import { component$ } from "@builder.io/qwik";
import type { Post } from "~/server/db/types";
import { TrpcActionStore } from "~/utils/trpc";
import { DeletePostForm } from "./DeletePostForm/DeletePostForm";
import { UpdatePostForm } from "./UpdatePostForm/UpdatePostForm";

type Props = {
  deletePostAction: TrpcActionStore;
  updatePostAction: TrpcActionStore;
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
