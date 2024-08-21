import { type KEY_STATUS } from "./constants";

export type KeyType = {
  key: string;
  status: KeyStatus;
};

export type AttemptType = {
  keys: KeyType[];
  status: "correct" | "incorrect" | "idle" | "pending";
};

export type KeyStatus = (typeof KEY_STATUS)[keyof typeof KEY_STATUS];
