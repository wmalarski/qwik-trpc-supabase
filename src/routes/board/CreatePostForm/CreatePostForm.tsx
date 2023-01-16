import { component$, PropFunction, useStore } from "@builder.io/qwik";
import type { Post } from "@prisma/client";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { useTrpcContext } from "~/routes/context";

type Props = {
  onSuccess$: PropFunction<(post: Post) => void>;
};

type State = {
  status: "idle" | "loading" | "success" | "error";
};

export const CreatePostForm = component$<Props>((props) => {
  const onSuccess$ = props.onSuccess$;

  const state = useStore<State>({ status: "idle" });
  const trpcContext = useTrpcContext();
  const isLoading = state.status === "loading";

  return (
    <div>
      <PostForm
        isLoading={isLoading}
        onSubmit$={async ({ content }) => {
          try {
            state.status = "loading";
            const trpc = await trpcContext();
            const result = await trpc?.post.create.mutate({ text: content });
            if (result) {
              onSuccess$(result);
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
