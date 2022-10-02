import { component$, useStore } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { trpc } from "~/utils/trpc";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  comment: Comment;
};

export const CommentActions = component$((props: Props) => {
  const state = useStore<State>({ status: "idle" });

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
            await trpc.comment.delete.mutate({ id: props.comment.id });
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
