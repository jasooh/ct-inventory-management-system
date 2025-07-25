// useAddPartsToInventory.ts
// Custom hook for adding new inventory items.

import {useCallback, useState} from "react";
import {InventoryPart} from "@/app/types/InventoryPart";
import {APIResponse} from "@/app/types/APIResponse";

export function useAddPartsToInventory() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Mutates the inventory database with the changed items.
     */
    const addNewPartsToDatabase = useCallback(
        async (newPart: InventoryPart): Promise<APIResponse> => {
            setIsLoading(true);
            setError(null);

            try {
                const res: Response = await fetch("/api/parts", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newPart),
                });
                if (!res.ok) {
                    throw new Error(`${res.status} — POST failed. Please try again.`);
                }
                return (await res.json()) as APIResponse;
            } catch (err) {
                setError(err as Error);
                throw err;
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    return {addNewPartsToDatabase, isLoading, error};
}