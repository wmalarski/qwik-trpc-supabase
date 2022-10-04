import { component$, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { trpc } from "~/utils/trpc";
import { PostForm } from "../../PostForm/PostForm";

type State = {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  post: Post;
};

export const UpdatePostForm = component$((props: Props) => {
  const state = useStore<State>({ isOpen: false, status: "idle" });

  return (
    <>
      <button
        class="btn"
        onClick$={() => {
          state.isOpen = !state.isOpen;
        }}
      >
        Edit
      </button>

      {state.isOpen && (
        <>
          <PostForm
            isLoading={state.status === "loading"}
            onSubmit$={async (data) => {
              try {
                state.status = "loading";
                await trpc.post.update.mutate({
                  id: props.post.id,
                  text: data.text,
                });
                state.status = "success";
              } catch (error) {
                state.status = "error";
              }
            }}
          />

          {state.status === "success" ? (
            <span>Success</span>
          ) : state.status === "error" ? (
            <span>Error</span>
          ) : null}
        </>
      )}
    </>
  );
});
