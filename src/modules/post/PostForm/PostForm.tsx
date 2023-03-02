import { component$, type PropFunction } from "@builder.io/qwik";

type FormResult = {
  content: string;
};

type Props = {
  initialValue?: FormResult;
  isLoading: boolean;
  onSubmit$: PropFunction<(result: FormResult) => void>;
};

export const PostForm = component$<Props>((props) => {
  const onSubmit$ = props.onSubmit$;

  return (
    <form
      class="flex flex-col gap-2"
      preventdefault:submit
      onSubmit$={(event) => {
        const form = new FormData(event.target as HTMLFormElement);
        const content = form.get("content") as string;
        onSubmit$({ content });
      }}
    >
      <h2 class="text-xl">Add post</h2>

      <div class="form-control w-full">
        <label for="content" class="label">
          <span class="label-text">Text</span>
        </label>
        <input
          class="input input-bordered w-full"
          name="content"
          id="content"
          placeholder="Type here"
          type="text"
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
