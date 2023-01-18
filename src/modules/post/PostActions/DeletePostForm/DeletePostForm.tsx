import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";

type Props = {
  action: FormProps<void>["action"];
  post: Post;
};

export const DeletePostForm = component$<Props>((props) => {
  return (
    <Form action={props.action}>
      <input type="hidden" name="id" value={props.post.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost btn-sm": true,
          loading: props.action.isPending,
        }}
      >
        Remove
      </button>

      {props.action.status === 200 ? (
        <span>Success</span>
      ) : typeof props.action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </Form>
  );
});
