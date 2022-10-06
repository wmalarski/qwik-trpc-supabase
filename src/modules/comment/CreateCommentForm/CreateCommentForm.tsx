import { component$, mutable, PropFunction, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";
import { CommentForm } from "../CommentForm/CommentForm";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  parentId: string | null;
  postId: string;
  onSuccess$?: PropFunction<() => void>;
};

export const CreateCommentForm = component$((props: Props) => {
  const state = useStore<State>({ status: "idle" });
  const isLoading = state.status === "loading";

  return (
    <div>
      <CommentForm
        isLoading={mutable(isLoading)}
        onSubmit$={async ({ content }) => {
          try {
            state.status = "loading";
            await trpc.comment.create.mutate({
              parentId: props.parentId,
              postId: props.postId,
              text: content,
            });
            props.onSuccess$?.();
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
