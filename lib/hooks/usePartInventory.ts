// useParts.ts
// Validates local inventory cache and queries inventory when necessary.

import {cacheParts, getPartsFromCache, getTimeWhenFetched} from "@/lib/localstorage";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {appConstants} from "@/lib/appConstants";
import {useEffect, useState} from "react";
import {InventoryPart} from "@/app/types/InventoryPart";

/**
 * A hook responsible for caching inventory data and querying the inventory database.
 *
 * @return The inventory data, whether the data is loading, and the error message from the procedure.
 */
export function usePartInventory() {
    const [inventoryData, setInventoryData] = useState<InventoryPart[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadInventoryParts = () => {
        setIsLoading(true);
        setError(null);

        // CACHE
        const cached = getPartsFromCache();
        const fetchedAt = getTimeWhenFetched();
        const expired =
            !fetchedAt ||
            Date.now() - fetchedAt >
            getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toMilliseconds);

        // Check if cached data is not empty and if the cache has not expired (5 minutes has passed)
        if (cached.length > 0 && !expired) {
            console.log("INFO: UI is rendering inventory from cached data");
            setInventoryData(cached);
            setIsLoading(false);
            return;
        }

        // DATABASE
        // Query the database if cache is expired or empty and cache the new data
        console.log("DEBUG: Retrieved inventory is empty or cache has expired.");
        fetch('/api/parts')
            .then(res => {
                if (!res.ok) throw new Error(`${res.status} - Fetch failed.`);
                return res.json() as Promise<InventoryPart[]>;
            })
            .then(data => {
                cacheParts(data);

                console.log("INFO: UI is rendering inventory from queried data");
                setInventoryData(data);
            })
            .catch(err => setError(err as Error))
            .finally(() => setIsLoading(false));
    };

    // Call this procedure every time the calling component mounts
    useEffect(() => loadInventoryParts(), []);

    return {inventoryData, isLoading, error}
}