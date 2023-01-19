import { component$ } from "@builder.io/qwik";
import { FormProps } from "@builder.io/qwik-city";
import { PostForm } from "~/modules/post/PostForm/PostForm";
import { useTrpcAction } from "~/utils/trpc";

type Props = {
  action: FormProps<void>["action"];
};

export const CreatePostForm = component$((props: Props) => {
  const action = useTrpcAction(props.action).post.create();

  return (
    <div>
      <PostForm
        isLoading={props.action.isPending}
        onSubmit$={({ content }) => {
          action.execute({ content });
        }}
      />
      {props.action.status === 200 ? (
        <span>Success</span>
      ) : typeof props.action.status !== "undefined" ? (
        <span>Error</span>
      ) : null}
    </div>
  );
});
