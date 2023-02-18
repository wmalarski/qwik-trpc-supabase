import { createTrpcServerApi } from "~/lib/qwik-trpc";
import type { AppRouter } from "./router";

export const trpc = createTrpcServerApi<AppRouter>();
