import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { trpcAction$ } from "~/lib/qwik-trpc2";
import { paths } from "~/utils/paths";

type Props = {
  comment: Comment;
};

export const useDeleteCommentAction = trpcAction$(() => ["comment", "delete"]);

export const DeleteCommentForm = component$<Props>((props) => {
  const action = useDeleteCommentAction();

  const navigate = useNavigate();

  return (
    <form
      preventdefault:submit
      onSubmit$={async () => {
        await action.run({ id: props.comment.id });
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
          loading: action.isRunning,
        }}
      >
        Remove
      </button>

      {action.value?.status === "success" ? (
        <span>Success</span>
      ) : action.value?.status === "error" ? (
        <pre>{JSON.stringify(action.value, null, 2)}</pre>
      ) : null}
    </form>
  );
});
