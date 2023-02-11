import { component$ } from "@builder.io/qwik";
import { action$, useNavigate } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { trpcAction } from "~/server/trpc/action";
import { paths } from "~/utils/paths";
import { useTrpcAction } from "~/utils/trpc";

type Props = {
  comment: Comment;
};

export const api = action$((data, event) => trpcAction(data, event));

export const DeleteCommentForm = component$<Props>((props) => {
  const action = useTrpcAction(api).comment.delete();

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

      {action.status === 200 ? (
        <span>Success</span>
      ) : typeof action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </form>
  );
});
