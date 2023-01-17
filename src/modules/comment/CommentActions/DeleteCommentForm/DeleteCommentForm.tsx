import { component$ } from "@builder.io/qwik";
import { Form, FormProps } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";

type Props = {
  comment: Comment;
  action: FormProps<void>["action"];
};

export const DeleteCommentForm = component$<Props>((props) => {
  return (
    <Form action={props.action}>
      <input type="hidden" name="id" value={props.comment.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost mt-2": true,
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
