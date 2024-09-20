import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const submitAttemptRouter = createTRPCRouter({
  submitAttempt: publicProcedure
    .input(
      z.object({
        keys: z.array(
          z.object({
            key: z.string(),
          }),
        ),
        dailyImageGuessId: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.db.dailyImageGuessAttempt.create({
        data: {
          guess: input.keys
            .map((key) => key.key)
            .join("")
            .toLowerCase(),
          dailyImageGuess: {
            connect: {
              id: input.dailyImageGuessId,
            },
          },
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const rightAnswer = await ctx.db.dailyImageGuess.findFirst({
        where: {
          id: input.dailyImageGuessId,
        },
      });
      const isCorrect =
        input.keys
          .map((key) => key.key)
          .join("")
          .toLowerCase() === rightAnswer?.answer;

      const keys = input.keys.map((key, index) => ({
        key: key.key,
        status: getKeyStatus(
          key.key.toLocaleLowerCase(),
          rightAnswer?.answer,
          index,
        ),
      }));
      return {
        keys,
        isCorrect,
      };
    }),
});

const getKeyStatus = (
  key: string,
  answer: string | undefined,
  index: number,
) => {
  if (!answer) {
    return "absent";
  }
  if (answer.includes(key)) {
    if (answer[index] === key) {
      return "correct";
    } else {
      return "incorrect";
    }
  }
  return "absent";
};
