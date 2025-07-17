// utils.ts
// Provides general utility functions used by the rest of the app.

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getMillisecondsFromMinutes(minutes: number): number {
  return minutes * 60 * 1000;
}
