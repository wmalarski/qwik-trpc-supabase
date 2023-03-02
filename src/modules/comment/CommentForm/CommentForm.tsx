import { component$, type PropFunction } from "@builder.io/qwik";

type FormResult = {
  content: string;
};

type Props = {
  initialValue?: Partial<FormResult>;
  isLoading: boolean;
  onSubmit$: PropFunction<(result: FormResult) => void>;
};

export const CommentForm = component$<Props>((props) => {
  const onSubmit$ = props.onSubmit$;

  return (
    <form
      preventdefault:submit
      class="flex flex-col gap-2"
      onSubmit$={(event) => {
        const form = new FormData(event.target as HTMLFormElement);
        const content = form.get("content") as string;
        onSubmit$({ content });
      }}
    >
      <h2 class="text-xl">Add comment</h2>

      <div class="form-control w-full">
        <label for="text" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="content"
          placeholder="Type here"
          type="content"
          value={props.initialValue?.content}
        />
      </div>

      <button
        class={{
          "btn btn-primary mt-2": true,
          loading: props.isLoading,
        }}
        type="submit"
      >
        Save
      </button>
    </form>
  );
});
