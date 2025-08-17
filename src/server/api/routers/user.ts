import z from "zod";
import { createTRPCRouter, publicProcedureRead } from "../trpc";
import { UserModel } from "~/models/user";

export const userRouter = createTRPCRouter({
  get: publicProcedureRead
    .input(z.object({ username: z.string() }))
    .query(async ({ input, ctx }) => {
      const model = new UserModel(ctx.db!);

      const user = model.get(input.username)

      return user;
    })
})
