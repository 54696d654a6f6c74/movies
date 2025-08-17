import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";
import type { Database } from 'sqlite';
import type sqlite3 from 'sqlite3'
import { openDb } from "~/lib/db";
import { type Session } from "next-auth";
import { getServerAuthSession } from "~/pages/api/auth/[...nextauth]";

type CreateContextOptions = {
  session: Session | null;
  db?: Database<sqlite3.Database, sqlite3.Statement>;
};


const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db: opts.db
  };
};

export async function createTRPCContext({ req, res }: CreateNextContextOptions) {
  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({ session });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const dbMiddleware = t.middleware(async ({ next, ctx }) => {
  const db = await openDb();
  ctx.db = db;

  const result = await next();

  await db.close();

  return result;
});

// TODO: Fix this
const authMiddleware = t.middleware(({ next, ctx }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      session: {
        ...ctx.session,
        user: ctx.session.user
      }
    }
  });
})

export const publicProcedure = t.procedure.use(timingMiddleware);
export const publicProcedureRead = t.procedure.use(timingMiddleware).use(dbMiddleware);
export const publicMutationProcedure = t.procedure.use(timingMiddleware).use(dbMiddleware);
export const protectedProcedure = t.procedure.use(timingMiddleware).use(dbMiddleware);
