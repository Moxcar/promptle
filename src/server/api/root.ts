import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { dailyImageRouter } from "./routers/dailyImage";
import { submitAttemptRouter } from "./routers/submitAttemptRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dailyImage: dailyImageRouter,
  submitAttempt: submitAttemptRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
