import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Comment } from "@prisma/client";
import { useTrpcContext } from "~/routes/context";
import { CommentForm } from "../CommentForm/CommentForm";

type State = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  parentId: string | null;
  postId: string;
  onSuccess$: PropFunction<(comment: Comment) => void>;
};

export const CreateCommentForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;
  const parentId = props.parentId;
  const postId = props.postId;

  const state = useStore<State>({ status: "idle" });
  const trpcContext = useTrpcContext();
  const isLoading = state.status === "loading";

  return (
    <div>
      <CommentForm
        isLoading={isLoading}
        onSubmit$={async ({ content }) => {
          try {
            state.status = "loading";
            const trpc = await trpcContext();
            const comment = await trpc?.comment.create.mutate({
              parentId,
              postId,
              text: content,
            });
            if (comment) {
              onSuccess$(comment);
            }
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
