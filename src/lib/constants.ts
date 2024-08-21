export const KEY_STATUS = {
  UNUSED: "unused",
  CORRECT: "correct",
  INCORRECT: "incorrect",
  ABSENT: "absent",
};

export const STATUS_COLORS: Record<string, string> = {
  correct: "bg-green-500",
  incorrect: "bg-yellow-500",
  unused: "bg-none",
  absent: "bg-red-500",
};
