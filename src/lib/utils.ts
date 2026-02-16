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
  const displayOldPrice = isExpired ? 0 : (batch.old_price || 0);

  return {
    currentPrice,
    displayOldPrice,
    isExpired,
  };
}
