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

      const keys = validateKeys(input.keys, rightAnswer?.answer);
      return {
        keys,
        isCorrect,
      };
    }),
});

const validateKeys = (
  keys: { key: string }[],
  answer: string | undefined,
) => {
  //Uppercase the answer and keys
  answer = answer?.toUpperCase();
  keys = keys.map(key => ({ key: key.key.toUpperCase() }));

  if (!answer) return keys.map(key => ({ key: key.key, status: "absent" }));
  let result = keys.map(key => ({ key: key.key, status: "absent" }));
  let usedAnswerIndices = [];

  //First mark correct positions and delete those letters from the answer
  for (let i = 0; i < answer.length; i++) {
    if (answer[i] === keys[i]?.key) {
      result[i] = { key: keys[i]!.key, status: "correct" };
      usedAnswerIndices.push(i);
      //Replace the letter in the answer with a space
      answer = answer.slice(0, i) + " " + answer.slice(i + 1);
    }
  }

  //Second mark incorrect positions and delete those letters from the answer
  for (let i = 0; i < keys.length; i++) {
    if (answer.includes(keys[i]!.key) && !usedAnswerIndices.includes(answer.indexOf(keys[i]!.key)) && result[i]?.status == "absent") {
      result[i] = { key: keys[i]!.key, status: "incorrect" };
      usedAnswerIndices.push(answer.indexOf(keys[i]!.key));
    }
  }

  return result;
};
