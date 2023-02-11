import { component$ } from "@builder.io/qwik";
import { action$, useNavigate } from "@builder.io/qwik-city";
import type { Post } from "@prisma/client";
import { trpcAction } from "~/server/trpc/action";
import { paths } from "~/utils/paths";
import { useTrpcAction } from "~/utils/trpc";

export const trpc = action$((data, event) => trpcAction(data, event));

type Props = {
  post: Post;
};

export const DeletePostForm = component$<Props>((props) => {
  const navigate = useNavigate();

  const action = useTrpcAction(trpc.use()).post.delete();

  return (
    <form
      preventdefault:submit
      onSubmit$={async () => {
        await action.run({ id: props.post.id });
        navigate(paths.board);
      }}
    >
      <input type="hidden" name="id" value={props.post.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost btn-sm": true,
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
