import { component$, PropFunction } from "@builder.io/qwik";

type FormResult = {
  text: string;
};

type Props = {
  isLoading: boolean;
  onSubmit$: PropFunction<(result: FormResult) => void>;
};

export const CommentForm = component$((props: Props) => {
  return (
    <form
      preventDefault:submit
      method="post"
      class="flex flex-col gap-2"
      onSubmit$={(event) => {
        const form = new FormData(event.target as HTMLFormElement);
        const text = (form.get("text") as string) || "";
        props.onSubmit$({ text });
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
          loading: props.isLoading,
        }}
        type="submit"
      >
        Save
      </button>
    </form>
  );
});
