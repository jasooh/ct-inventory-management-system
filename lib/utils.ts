// getUserIP.ts
// Provides general utility functions used by the rest of the app.

import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export enum conversionTypes {
    toMilliseconds = "milliseconds",
    toSeconds = "seconds",
}

/**
 * Returns miliseconds converted from minutes.
 *
 * @param minutes The minutes to convert.
 * @param conversion The unit to convert minutes to.
 */
export function getTimeFromMinutes(minutes: number, conversion: conversionTypes) {
    switch (conversion) {
        case conversionTypes.toMilliseconds:
            return minutes * 60 * 1000;
        case conversionTypes.toSeconds:
            return minutes * 60;
    }
}
