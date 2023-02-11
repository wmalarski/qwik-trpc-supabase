import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const commentRouter = t.router({
  create: protectedProcedure
    .input(
      z.object({
        content: z.string(),
        parentId: z.string().cuid().nullable(),
        postId: z.string().cuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.create({
        data: {
          content: input.content,
          createdById: ctx.user.id,
          parentId: input.parentId,
          postId: input.postId,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.deleteMany({
        where: { createdById: ctx.user.id, id: input.id },
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.comment.findFirstOrThrow({
        where: { id: input.id },
      });
    }),
  listForParent: protectedProcedure
    .input(
      z.object({
        parentId: z.string().cuid().nullable(),
        skip: z.number().min(0),
        take: z.number().min(0).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const [comments, count] = await Promise.all([
        ctx.prisma.comment.findMany({
          orderBy: { createdAt: "desc" },
          skip: input.skip,
          take: input.take,
          where: { parentId: input.parentId },
        }),
        ctx.prisma.comment.count({
          where: { parentId: input.parentId },
        }),
      ]);
      return { comments, count };
    }),
  listForPost: protectedProcedure
    .input(
      z.object({
        postId: z.string().cuid(),
        skip: z.number().min(0),
        take: z.number().min(0).max(100),
      })
    )
    .query(async ({ input, ctx }) => {
      const [comments, count] = await Promise.all([
        ctx.prisma.comment.findMany({
          orderBy: { createdAt: "desc" },
          skip: input.skip,
          take: input.take,
          where: { parentId: null, postId: input.postId },
        }),
        ctx.prisma.comment.count({
          where: { parentId: null, postId: input.postId },
        }),
      ]);
      return { comments, count };
    }),
  update: protectedProcedure
    .input(z.object({ content: z.string(), id: z.string().cuid() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.comment.updateMany({
        data: { content: input.content },
        where: { createdById: ctx.user.id, id: input.id },
      });
    }),
});
