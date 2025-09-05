import { z } from "zod";
import { type MovieResponse } from "~/types/omdb";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { MovieModel, MovieSchema } from "~/models/movie";
import { env } from "~/env";

export const movieRouter = createTRPCRouter({
  find: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const model = new MovieModel(ctx.db!);
        const movie = await model.get(input.id);

        if (movie) {
          return {
            id: movie.id,
            title: movie.title,
            imageUrl: movie.image_url,
            sugguested: true
          };
        }

        const res = await fetch(`http://www.omdbapi.com/?apikey=${env.API_KEY}&i=${input.id}`)
        const data = (await res.json()) as MovieResponse;

        return {
          id: input.id,
          title: data.Title,
          imageUrl: data.Poster,
          sugguested: false
        }
      } catch (e) {
        console.error(e);
      }
    }),

  getUnwatched: protectedProcedure
    .query(async ({ ctx }) => {

      const model = new MovieModel(ctx.db!);

      return model.getUnwatched();
    }),

  getWatched: protectedProcedure
    .query(async ({ ctx }) => {

      const model = new MovieModel(ctx.db!);

      return model.getWatched();
    }),

  add: protectedProcedure.input(MovieSchema).mutation(async ({ input, ctx }) => {
    const model = new MovieModel(ctx.db!);

    return model.add(input);
  })
});

