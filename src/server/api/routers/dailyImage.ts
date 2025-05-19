import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dailyImageRouter = createTRPCRouter({
  getImageUrlOfTheDay: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      return ctx.db.dailyImageGuess
        .findFirst({
          orderBy: { createdAt: "desc" },
          where: {
            id: input ?? undefined,
          },
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

  getImagesForBackground: publicProcedure
    .input(
      z
        .object({
          amount: z.number().optional(),
          skip: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.dailyImageGuess
        .findMany({
          orderBy: { createdAt: "desc" },
          take: input?.amount ?? 100,
          skip: input?.skip ?? 0,
        })
        .then((dailyImageGuesses) => {
          return dailyImageGuesses.map((dailyImageGuess) => {
            return {
              imageUrl: dailyImageGuess?.imageUrl,
              wordLength: dailyImageGuess?.answer.length,
              dailyImageGuessId: dailyImageGuess?.id,
            };
          });
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
