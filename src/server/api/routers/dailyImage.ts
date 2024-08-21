import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dailyImageRouter = createTRPCRouter({
  getImageUrlOfTheDay: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.dailyImageGuess
      .findFirst({
        orderBy: { createdAt: "desc" },
      })
      .then((dailyImageGuess) => {
        console.log("dailyImageGuess", dailyImageGuess);
        return {
          imageUrl: dailyImageGuess?.imageUrl,
          wordLength: dailyImageGuess?.answer.length,
          dailyImageGuessId: dailyImageGuess?.id,
        };
      });
  }),

  createDailyImageGuess: publicProcedure
    .input(
      z.object({
        imageUrl: z.string(),
        word: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      return ctx.db.dailyImageGuess.create({
        data: {
          imageUrl: input.imageUrl,
          answer: input.word,
        },
      });
    }),
});
