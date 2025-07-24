// usePartCategories.ts
// Validates local category cache and queries categories when necessary.

import {useEffect, useState} from "react";
import {InventoryCategory} from "@/app/types/InventoryPart";
import {cacheCategories, getCategoriesFromCache, getTimeWhenFetched} from "@/lib/localstorage";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {appConstants} from "@/lib/appConstants";

/**
 * A hook responsible for caching inventory category data and querying for them.
 *
 * @return The category data, whether the data is loading, and the error message from the procedure.
 */
export function usePartCategories() {
    const [categoryData, setCategoryData] = useState<InventoryCategory[]>([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadCategories = () => {
        setIsLoading(true);
        setError(null);

        // CACHE
        const cached = getCategoriesFromCache();
        const fetchedAt = getTimeWhenFetched();
        const expired =
            !fetchedAt ||
            Date.now() - fetchedAt >
            getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toMilliseconds);

        // Check if cached data is not empty and if the cache has not expired (5 minutes has passed)
        if (cached.length > 0 && !expired) {
            console.log("INFO: UI is rendering categories from cached data");
            setCategoryData(cached);
            setIsLoading(false);
            return;
        }

        // DATABASE
        console.log("DEBUG: Retrieved category data is empty or cache has expired.");
        fetch('/api/parts/categories')
            .then(res => {
                if (!res.ok) throw new Error(`${res.status} - Fetch failed.`);
                return res.json() as Promise<InventoryCategory[]>;
            })
            .then(data => {
                cacheCategories(data);

                console.log("INFO: UI is rendering categories from queried data");
                setCategoryData(data);
            })
            .catch(err => setError(err))
            .finally(() => setIsLoading(false));
    }

    // Call this procedure every time the calling component mounts
    useEffect(() => loadCategories(), []);

    return {categoryData, isLoading, error}
}