import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const blockInvalidChar = (e: {
  key: string;
  preventDefault: () => void;
}) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();


export const clipSentence = (
  str: string | undefined,
  wordAmount: number
): string => {
  if (!str) return "";

  if (str?.length > wordAmount) {
    str = str?.substring(0, wordAmount) + "...";
  }
  return str;
};
