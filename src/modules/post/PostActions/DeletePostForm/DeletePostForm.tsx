import { component$ } from "@builder.io/qwik";
import { useNavigate } from "@builder.io/qwik-city";
import type { Post } from "~/server/db/types";
import { paths } from "~/utils/paths";
import { TrpcActionStore, useTrpcAction } from "~/utils/trpc";

type Props = {
  action: TrpcActionStore;
  post: Post;
};

export const DeletePostForm = component$<Props>((props) => {
  const navigate = useNavigate();

  const action = useTrpcAction(props.action).post.delete();

  return (
    <form
      preventdefault:submit
      onSubmit$={async () => {
        await action.execute({ id: props.post.id });
        navigate(paths.board);
      }}
    >
      <input type="hidden" name="id" value={props.post.id} />
      <button
        type="submit"
        class={{
          "btn btn-ghost btn-sm": true,
          loading: props.action.isRunning,
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
