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
  wordAmount: number,
): string => {
  if (!str) return "";

  if (str?.length > wordAmount) {
    str = str?.substring(0, wordAmount) + "...";
  }
  return str;
};

export const buildQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "all") {
      query.append(key, value);
    }
  });
  return query.toString();
};

export const formatPriceAmount = (
  amount: number | undefined,
  currency: string = "NGN",
  includeCurrency = true,
): string => {
  if (amount === undefined) return "Not set";

  const formattedAmount = Number(amount).toFixed(2);
  const [integerPart, decimalPart] = formattedAmount.split(".");

  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ",",
  );

  let currencySymbol = "";
  if (includeCurrency) {
    switch (currency?.toUpperCase()) {
      case "NGN":
        currencySymbol = "₦";
        break;
      case "USD":
        currencySymbol = "$";
        break;
      default:
        currencySymbol = "₦";
    }
  }

  return `${
    includeCurrency ? currencySymbol + " " : ""
  }${formattedIntegerPart}.${decimalPart}`;
};
