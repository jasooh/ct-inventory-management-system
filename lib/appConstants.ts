// constants.ts
// Constants used by the app.

export enum appConstants {
    BUILD_VERSION = 'v.1.0',
    PARTS_KEY = 'cachedInventory',
    CATEGORY_KEY = 'cacheCategory',
    TIME_WHEN_FETCHED_KEY = 'timeWhenFetched',

    // Fetching catalogue data
    CACHE_CALL_LIMIT = 10,           // The amount of API calls that can be made in a specific time
    CACHE_DEBOUNCE_IN_MINUTES = 10,  // The amount of time (in minutes) before the app re-queries the database.

    // Adding part images
    IMAGE_ADD_LIMIT = 5,             // The amount of times the user can add a new image via the API layer
    IMAGE_ADD_DEBOUNCE_IN_MINUTES = 1
}