import { component$, useStore } from "@builder.io/qwik";
import { trpc } from "~/utils/trpc";

type CreateCommentFormState = {
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  parentId: string | null;
  postId: string;
};

export const CreateCommentForm = component$((props: Props) => {
  const state = useStore<CreateCommentFormState>({ status: "idle" });

  return (
    <form
      preventDefault:submit
      method="post"
      class="flex flex-col gap-2"
      onSubmit$={async (event) => {
        const form = new FormData(event.target as HTMLFormElement);
        const text = (form.get("text") as string) || "";
        try {
          state.status = "loading";
          await trpc.comment.create.mutate({
            parentId: props.parentId,
            postId: props.postId,
            text,
          });
          state.status = "success";
        } catch (error) {
          state.status = "error";
        }
      }}
    >
      <h2 class="text-xl">Add comment</h2>

      <div class="form-control w-full">
        <label htmlFor="text" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="text"
          placeholder="Type here"
          type="text"
        />
      </div>

      <button
        class={{
          "btn btn-primary mt-2": true,
          loading: state.status === "loading",
        }}
        type="submit"
      >
        Save
      </button>

      {state.status === "success" ? (
        <span>Success</span>
      ) : state.status === "error" ? (
        <span>Error</span>
      ) : null}
    </form>
  );
});
