import { KEY_STATUS } from "./constants";

type KeyType = {
  key: string;
  status: string;
};

export default function initializeKeys(): KeyType[][] {
  const keys: string[][] = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];
  return keys.map((row) => {
    return row.map((key) => {
      return {
        key,
        status: KEY_STATUS.UNUSED,
      };
    });
  });
}
