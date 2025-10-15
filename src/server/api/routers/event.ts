import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { env } from "~/env";

export const eventRouter = createTRPCRouter({
  get: protectedProcedure
    .query(() => {
      if (!env.EVENT_TIME || !env.EVENT_LOCATION) return;

      if (env.EVENT_TIME <= Date.now()) return;

      return {
        location: env.EVENT_LOCATION,
        time: env.EVENT_TIME
      }
    }),
});


