// localstorage.ts
// A file containing methods that manage the app's localstorage.

import {InventoryCategory, InventoryPart} from "@/app/types/InventoryPart";
import {appConstants} from "@/lib/appConstants";

// ---- PART CACHE

/**
 * Saves the provided part array locally using localStorage.
 *
 * @param parts The array of inventory parts to cache.
 */
export function cacheParts(parts: InventoryPart[]): void {
    console.log("INFO: Saving part data to cache...")
    localStorage.setItem(appConstants.PARTS_KEY, JSON.stringify(parts));
    localStorage.setItem(appConstants.TIME_WHEN_FETCHED_KEY, JSON.stringify(Date.now()));
}

/**
 * Retrieves the inventory data from the cache if it exists. Always returns an empty array on failure.
 *
 * @return An array of part data representing the inventory.
 */
export function getPartsFromCache(): InventoryPart[] {
    try {
        const partsReceived = localStorage.getItem(appConstants.PARTS_KEY);
        if (partsReceived != null && partsReceived.length > 0) {
            console.log("DEBUG: Local parts cache found! Retrieving...");
            return JSON.parse(partsReceived) as InventoryPart[];
        } else {
            console.log("DEBUG: Local parts cache not found. Returning empty array...");
            return [];
        }
    } catch {
        console.log("ERROR: Error retrieving local part data, clearing cache...")
        localStorage.removeItem(appConstants.PARTS_KEY);
        return [];
    }
}

// ---- CATEGORY CACHE

/**
 * Saves the provided category array locally using localStorage.
 *
 * @param parts The array of inventory parts to cache.
 */
export function cacheCategories(parts: InventoryCategory[]): void {
    console.log("INFO: Saving category data to cache...")
    localStorage.setItem(appConstants.CATEGORY_KEY, JSON.stringify(parts));
    localStorage.setItem(appConstants.TIME_WHEN_FETCHED_KEY, JSON.stringify(Date.now()));
}

/**
 * Retrieves the category data from the cache if it exists. Always returns an empty array on failure.
 *
 * @return An array of category data representing the categories in the inventory.
 */
export function getCategoriesFromCache(): InventoryCategory[] {
    try {
        const categoriesReceived = localStorage.getItem(appConstants.CATEGORY_KEY);
        if (categoriesReceived != null && categoriesReceived.length > 0) {
            console.log("DEBUG: Local category cache found! Retrieving...");
            return JSON.parse(categoriesReceived) as InventoryCategory[];
        } else {
            console.log("DEBUG: Local category cache not found. Returning empty array...");
            return [];
        }
    } catch {
        console.log("ERROR: Error retrieving local category data, clearing cache...")
        localStorage.removeItem(appConstants.PARTS_KEY);
        return [];
    }
}

// ---- OTHER

/**
 * Obtains the time since the last local cache save.
 *
 * @return The Date object containing the date the last time the cache was saved.
 */
export function getTimeWhenFetched(): number {
    try {
        const cacheTimestamp = localStorage.getItem(appConstants.TIME_WHEN_FETCHED_KEY);
        return cacheTimestamp ? JSON.parse(cacheTimestamp) : 0;
    } catch {
        return 0;
    }
}