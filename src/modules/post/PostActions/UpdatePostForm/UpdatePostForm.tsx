import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { useTrpcContext } from "~/routes/context";
import { PostForm } from "../../PostForm/PostForm";

type State = {
  isOpen: boolean;
  status: "idle" | "loading" | "success" | "error";
};

type Props = {
  onSuccess$: PropFunction<(post: Post) => void>;
  post: Post;
};

export const UpdatePostForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;
  const postId = props.post.id;

  const state = useStore<State>({ isOpen: false, status: "idle" });
  const trpcContext = useTrpcContext();
  const isLoading = state.status === "loading";

  return (
    <>
      <button
        class="btn btn-ghost btn-sm"
        onClick$={() => {
          state.isOpen = !state.isOpen;
        }}
      >
        Edit
      </button>

      {state.isOpen && (
        <>
          <PostForm
            initialValue={props.post}
            isLoading={isLoading}
            onSubmit$={async ({ content }) => {
              try {
                state.status = "loading";
                const trpc = await trpcContext();
                await trpc?.post.update.mutate({ id: postId, text: content });
                onSuccess$({ ...props.post, content });
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
