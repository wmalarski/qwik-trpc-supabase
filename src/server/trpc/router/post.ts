import { z } from "zod";
import { protectedProcedure, t } from "../trpc";

export const postRouter = t.router({
  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: { content: input.content, createdById: ctx.user.id },
      });
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
    .query(({ input, ctx }) => {
      return ctx.prisma.post.findFirstOrThrow({
        where: { id: input.id },
      });
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
        ctx.prisma.post.findMany({
          orderBy: { createdAt: "desc" },
          skip: input.skip,
          take: input.take,
        }),
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
