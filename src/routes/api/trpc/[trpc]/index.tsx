import { trpcOnRequest$ } from "~/lib/qwik-trpc2";
import { getTrpcFromEvent } from "~/server/loaders";

export const onRequest = trpcOnRequest$((event) => getTrpcFromEvent(event));
