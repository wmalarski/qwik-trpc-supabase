import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";
import { CommentForm } from "../CommentForm/CommentForm";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$((props: Props) => {
  const state = useStore<State>({ status: "idle" });

  return (
    <div>
      <CommentForm
        isLoading={state.status === "loading"}
        onSubmit$={async (data) => {
          try {
            state.status = "loading";
            await trpc.comment.create.mutate({
              parentId: props.parentId,
              postId: props.postId,
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
    </div>
  );
});
