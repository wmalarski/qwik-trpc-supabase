import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { Comment } from "@prisma/client";
import { CommentActions } from "~/modules/comment/CommentActions/CommentActions";
import { CommentsList } from "~/modules/comment/CommentsList/CommentsList";
import { CreateCommentForm } from "~/modules/comment/CreateCommentForm/CreateCommentForm";
import { trpc } from "~/routes/plugin@trpc";
import { paths } from "~/utils/paths";

export const useComment = routeLoader$((event) => {
  return trpc.comment.get.loader(event, {
    id: event.params.commentId,
  });
});

export const useComments = routeLoader$((event) => {
  return trpc.comment.listForParent.loader(event, {
    parentId: event.params.commentId,
    skip: 0,
    take: 10,
  });
});

const queryMoreComments = trpc.comment.listForParent.query();

type CommentCardProps = {
  comment: Comment;
};

export const CommentCard = component$<CommentCardProps>((props) => {
  const comments = useComments();

  const collection = useSignal<Comment[]>([]);
  const page = useSignal(0);

  const backPath = props.comment.parentId
    ? paths.comment(props.comment.parentId)
    : paths.post(props.comment.postId);

  useTask$(({ track }) => {
    const trackedComments = track(() => comments.value);
    if (trackedComments.status === "success") {
      collection.value = trackedComments.result.comments;
      page.value = 0;
    }
  });

  return (
    <div>
      <Link class="link" href={backPath}>
        Back
      </Link>
      <pre>{JSON.stringify(props.comment, null, 2)}</pre>
      <CommentActions comment={props.comment} />
      <CreateCommentForm
        parentId={props.comment.id}
        postId={props.comment.postId}
      />
      {comments.value.status === "success" ? (
        <CommentsList
          comments={collection.value}
          count={comments.value.result.count}
        />
      ) : null}
      <button
        class="btn"
        onClick$={async () => {
          const value = await queryMoreComments({
            parentId: props.comment.id,
            skip: (page.value + 1) * 10,
            take: 10,
          });
          if (value.status === "success") {
            const nextCollection = [...collection.value];
            nextCollection.push(...value.result.comments);
            collection.value = nextCollection;
            page.value += 1;
          }
        }}
      >
        Load more
      </button>
    </div>
  );
});

export default component$(() => {
  const comment = useComment();

  return (
    <div class="flex flex-col gap-2">
      <h1>Comment</h1>
      {comment.value.status === "success" ? (
        <CommentCard comment={comment.value.result} />
      ) : null}
    </div>
  );
});

export const head: DocumentHead = {
  title: "Board - Welcome to Qwik",
};
