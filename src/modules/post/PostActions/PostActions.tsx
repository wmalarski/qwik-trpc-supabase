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
  const id = `menu-${props.post.id}`;
  return (
    <div class="dropdown">
      {/* eslint-disable-next-line */}
      <label for={id} tabIndex={0} role="button" class="btn m-1">
        Click
      </label>
      <ul
        id={id}
        tabIndex={0}
        role="menu"
        class="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
      >
        <li>
          <DeletePostForm
            post={props.post}
            onSuccess$={props.onDeleteSuccess$}
          />
        </li>
        <li>
          <UpdatePostForm
            post={props.post}
            onSuccess$={props.onUpdateSuccess$}
          />
        </li>
      </ul>
    </div>
  );
});
