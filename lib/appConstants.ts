// constants.ts
// Constants used by the app.

export enum appConstants {
    BUILD_VERSION = 'v.1.0',
    PARTS_KEY = 'cachedInventory',
    CATEGORY_KEY = 'cacheCategory',
    TIME_WHEN_FETCHED_KEY = 'timeWhenFetched',
    CACHE_DEBOUNCE_IN_MINUTES = 5  // The amount of time (in minutes) before the app re-queries the database.
}