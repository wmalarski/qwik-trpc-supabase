import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { useTrpcContext } from "~/routes/context";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  comment: Comment;
  onSuccess$?: PropFunction<() => void>;
};

export const DeleteCommentForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;
  const commentId = props.comment.id;

  const state = useStore<State>({ status: "idle" });
  const trpcContext = useTrpcContext();

  return (
    <>
      <button
        class={{
          "btn btn-ghost mt-2": true,
          loading: state.status === "loading",
        }}
        onClick$={async () => {
          try {
            state.status = "loading";
            const trpc = await trpcContext();
            await trpc?.comment.delete.mutate({ id: commentId });
            onSuccess$?.();
            state.status = "success";
          } catch (error) {
            state.status = "error";
          }
        }}
      >
        Remove
      </button>

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </>
  );
});
