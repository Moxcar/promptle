"use client";

import React, {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import initializeKeys from "~/lib/initializeKeys";
import {
  type AttemptType,
  type KeyType,
  type GameStatusType,
} from "~/lib/types";
import { api } from "~/trpc/react";
import Alert from "./Alert";

type GlobalStateContextType = {
  keys: KeyType[][];
  setKeys: React.Dispatch<React.SetStateAction<KeyType[][]>>;
  attempts: AttemptType[];
  setAttempts: React.Dispatch<React.SetStateAction<AttemptType[]>>;
  submitCurrentAttempt: (dailyImageGuessId: number, length: number) => void;
  gameStatus: GameStatusType;
};

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined,
);

const totalAttempts = 5;

const initializeAttempts = (): AttemptType[] => {
  return new Array(totalAttempts).fill(null).map((_, index) => ({
    status: index === 0 ? "pending" : "idle",
    keys: [],
  }));
};

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
  const [keys, setKeys] = useState<KeyType[][]>(initializeKeys());
  const [attempts, setAttempts] = useState(initializeAttempts());
  const [gameStatus, setGameStatus] = useState<GameStatusType>("playing");
  const submitAttempt = api.submitAttempt.submitAttempt.useMutation();
  const submitCurrentAttempt = async (
    dailyImageGuessId: number,
    length: number,
  ): Promise<void> => {
    const newAttempts = await Promise.all(
      attempts.map(async (attempt) => {
        if (attempt.status === "pending") {
          if (attempt.keys.length < length) {
            alert("Please fill all the blanks");
            return attempt;
          }
          const result = await submitAttempt.mutateAsync({
            keys: attempt.keys,
            dailyImageGuessId,
          });
          for (const key of result.keys) {
            keys.map((row) => {
              row.map((k) => {
                if (k.key === key.key) {
                  if (k.status != "correct") {
                    k.status = key.status;
                  }
                }
              });
            });
          }
          return {
            status: result.isCorrect ? "correct" : "incorrect",
            keys: result.keys,
          } as AttemptType;
        }
        return attempt;
      }),
    );
    if (newAttempts.find((attempt) => attempt.status === "pending")) {
      return;
    }
    if (newAttempts.find((attempt) => attempt.status === "correct")) {
      setAttempts(newAttempts);
      setGameStatus("won");
      return;
    }
    const idleAttempt = newAttempts.find(
      (attempt) => attempt.status === "idle",
    );
    if (idleAttempt) {
      idleAttempt.status = "pending";
    } else {
      setGameStatus("lost");
    }
    setAttempts(newAttempts);
  };

  return (
    <GlobalStateContext.Provider
      value={{
        keys,
        setKeys,
        attempts,
        setAttempts,
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        submitCurrentAttempt,
        gameStatus,
      }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);
