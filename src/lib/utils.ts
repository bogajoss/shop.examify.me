import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateBatchPrice(batch: {
  price: number;
  old_price?: number;
  offer_expires_at?: string | null;
}) {
  const isExpired =
    batch.offer_expires_at && new Date(batch.offer_expires_at) < new Date();

  const currentPrice = isExpired ? batch.old_price || batch.price : batch.price;
  const displayOldPrice = isExpired ? 0 : batch.old_price || 0;

  return {
    currentPrice,
    displayOldPrice,
    isExpired,
  };
}

export function toBengaliNumber(number: number | string): string {
  const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return number
    .toString()
    .split("")
    .map((digit) => {
      const index = parseInt(digit, 10);
      return !Number.isNaN(index) ? bengaliDigits[index] : digit;
    })
    .join("");
}

export function formatBengaliDate(dateString: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  // Use bn-BD locale for standard Bengali formatting
  const formatted = new Intl.DateTimeFormat("bn-BD", options).format(date);
  return formatted;
}
