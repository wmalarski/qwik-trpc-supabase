import { httpBatchLink } from "@trpc/client";
import { serverTrpc$ } from "~/lib/qwik-trpc3";
import type { AppRouter } from "~/server/trpc/router";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return ""; // browser should use relative url
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  }
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const { trpc, onRequest, client } = serverTrpc$<AppRouter>(
  async (event) => {
    const { appRouter } = await import("~/server/trpc/router");

    return {
      appRouter,
      createContext: async () => {
        const { getUserFromEvent } = await import("~/server/loaders");
        const { createSupabase } = await import("~/server/auth/auth");
        const { prisma } = await import("~/server/db/client");

        const user = await getUserFromEvent(event);
        return { prisma, supabase: createSupabase(), user };
      },
    };
  },
  {
    client: {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          // You can pass any HTTP headers you wish here
        }),
      ],
    },
    prefix: "/api/trpc",
  }
);
