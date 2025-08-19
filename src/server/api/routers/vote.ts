import z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { VoteModel, type Vote } from "~/models/vote";
import { randomUUID } from "crypto";

export const voteRouter = createTRPCRouter({
  getAllForMovie: protectedProcedure
    .input(z.object({ movieId: z.string() }))
    .query(async ({ input, ctx }) => {
      const model = new VoteModel(ctx.db!);

      const votes = await model.getForMovie(input.movieId)

      return votes;
    }),

  addVote: protectedProcedure
    .input(z.object({ movieId: z.string(), userId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const model = new VoteModel(ctx.db!);

      const vote: Vote = {
        id: randomUUID(),
        username: input.userId,
        movie_id: input.movieId
      };

      return model.addVote(vote)
    }),

  removeVote: protectedProcedure
    .input(z.object({ userId: z.string(), movieId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const model = new VoteModel(ctx.db!);

      return model.removeVoteForUser(input.userId, input.movieId);
    })
})

