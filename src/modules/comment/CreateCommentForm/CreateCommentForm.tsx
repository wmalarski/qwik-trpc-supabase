import { component$ } from "@builder.io/qwik";
import { actionTrpc } from "~/routes/plugin@trpc";
import { CommentForm } from "../CommentForm/CommentForm";

export const useCreateComment = actionTrpc.comment.create.globalAction$();

type Props = {
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$<Props>((props) => {
  const action = useCreateComment();

  return (
    <div>
      <CommentForm
        isLoading={action.isRunning}
        onSubmit$={({ content }) => {
          action.submit({
            content,
            parentId: props.parentId,
            postId: props.postId,
          });
        }}
      />

      {action.value?.status === "success" ? (
        <span>Success</span>
      ) : action.value?.status === "error" ? (
        <pre>{JSON.stringify(action.value, null, 2)}</pre>
      ) : null}
    </div>
  );
});
