import { component$ } from "@builder.io/qwik";
import { FormProps, useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "~/server/db/types";
import { paths } from "~/utils/paths";
import { useTrpcAction } from "~/utils/trpc";

type Props = {
  comment: Comment;
  action: FormProps<void>["action"];
};

export const DeleteCommentForm = component$<Props>((props) => {
  const action = useTrpcAction(props.action).comment.delete();

  const navigate = useNavigate();

  return (
    <form
      preventdefault:submit
      onSubmit$={async () => {
        await action.execute({ id: props.comment.id });
        navigate(
          props.comment.parentId
            ? paths.comment(props.comment.parentId)
            : paths.post(props.comment.postId)
        );
      }}
    >
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
    </form>
  );
});
