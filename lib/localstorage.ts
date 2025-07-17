// localstorage.ts
// A file containing methods that manage the app's localstorage.

import {Part} from "@/app/types/part";

const PARTS_KEY = 'cachedInventory';
const TIME_WHEN_FETCHED_KEY = 'timeWhenFetched';

/**
 * Saves the provided part array locally using localStorage.
 *
 * @param parts The array of inventory parts to cache.
 */
export function cacheParts(parts: Part[]): void {
    console.log("INFO: Saving part data to cache...")
    localStorage.setItem(PARTS_KEY, JSON.stringify(parts));
    localStorage.setItem(TIME_WHEN_FETCHED_KEY, JSON.stringify(Date.now()));
}

/**
 * Retrieves the inventory data from the cache if it exists. Always returns an empty array on failure.
 *
 * @return An array of part data representing the inventory.
 */
export function getPartsFromCache(): Part[] {
    try {
        const partsReceived = localStorage.getItem(PARTS_KEY);
        if (partsReceived != null && partsReceived.length > 0) {
            console.log("DEBUG: Local cache found! Retrieving...");
            return JSON.parse(partsReceived) as Part[];
        } else {
            console.log("DEBUG: Local cache not found. Returning empty array...");
            return [];
        }
    } catch {
        console.log("ERROR: Error retrieving local part data, clearing cache...")
        localStorage.removeItem(PARTS_KEY);
        return [];
    }
}

/**
 * Obtains the time since the last local cache save.
 *
 * @return The Date object containing the date the last time the cache was saved.
 */
export function getTimeWhenFetched(): number {
    try {
        const cacheTimestamp = localStorage.getItem(TIME_WHEN_FETCHED_KEY);
        return cacheTimestamp ? JSON.parse(cacheTimestamp) : 0;
    } catch {
        return 0;
    }
}