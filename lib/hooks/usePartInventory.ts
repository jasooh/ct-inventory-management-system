// useParts.ts

import {cacheParts, getPartsFromCache, getTimeWhenFetched} from "@/lib/localstorage";
import {getMillisecondsFromMinutes} from "@/lib/utils";
import {appConstants} from "@/lib/appConstants";
import {useEffect, useState} from "react";
import {Part} from "@/app/types/part";

/**
 * A hook responsible for caching inventory data and querying the inventory database.
 *
 * @return The inventory data, whether the data is loading, and the error message from the procedure.
 */
export function usePartInventory() {
    const [inventoryData, setInventoryData] = useState<Part[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const loadParts = (): void => {
        setIsLoading(true);
        setError(null);

        const cached = getPartsFromCache();
        const fetchedAt = getTimeWhenFetched();
        const expired =
            !fetchedAt ||
            Date.now() - fetchedAt >
            getMillisecondsFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES);

        // Check if cached data is not empty and if the cache has not expired (5 minutes has passed)
        if (cached.length > 0 && !expired) {
            console.log("INFO: UI is rendering cached data");
            setInventoryData(cached);
            setIsLoading(false);
            return;
        }

        // Query the database otherwise and cache the new data
        console.log("DEBUG: Retrieved inventory is empty or cache has expired.");
        fetch('/api/parts')
            .then(res => {
                if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
                return res.json() as Promise<Part[]>;
            })
            .then(data => {
                cacheParts(data);

                console.log("INFO: UI is rendering queried data");
                setInventoryData(data);
            })
            .catch(err => setError(err as Error))
            .finally(() => setIsLoading(false));
    };

    // Call this procedure every time the calling component mounts
    useEffect(() => loadParts(), []);

    return {inventoryData, isLoading, error}
}