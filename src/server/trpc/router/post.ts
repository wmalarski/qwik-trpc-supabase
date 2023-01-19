import type { Post as PrismaPost } from "@prisma/client";
import { z } from "zod";
import type { Post } from "../../db/types";
import { protectedProcedure, t } from "../trpc";

const stringifyPostDate = (post: PrismaPost): Post => {
  return { ...post, createdAt: post.createdAt.toISOString() };
};

export const postRouter = t.router({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: { content: input.content, createdById: ctx.user.id },
      });
      return stringifyPostDate(post);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.deleteMany({
        where: { createdById: ctx.user.id, id: input.id },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input, ctx }) => {
      const post = await ctx.prisma.post.findFirstOrThrow({
        where: { id: input.id },
      });
      return stringifyPostDate(post);
    }),
  list: protectedProcedure
    .input(
      z.object({
        skip: z.number().min(0),
        take: z.number().min(0).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const [posts, count] = await Promise.all([
        ctx.prisma.post
          .findMany({
            orderBy: { createdAt: "desc" },
            skip: input.skip,
            take: input.take,
          })
          .then((posts) => posts.map(stringifyPostDate)),
        ctx.prisma.post.count(),
      ]);
      return { count, posts };
    }),
  update: protectedProcedure
    .input(z.object({ content: z.string(), id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.updateMany({
        data: { content: input.content },
        where: { createdById: ctx.user.id, id: input.id },
      });
    }),
});
