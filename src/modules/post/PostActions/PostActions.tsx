import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { trpc } from "~/utils/trpc";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  onDeleteSuccess$?: PropFunction<() => void>;
  post: Post;
};

export const PostActions = component$((props: Props) => {
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
            await trpc.post.delete.mutate({ id: props.post.id });
            props.onDeleteSuccess$?.();
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
