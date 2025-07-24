// addPartsToInventory.ts
// Custom hook for committing edited inventory changes.

import {InventoryPart} from "@/app/types/InventoryPart";
import {APIResponse} from "@/app/types/APIResponse";
import {useCallback, useState} from "react";

export function useAddPartsToInventory() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    /**
     * Mutates the inventory database with the changed items.
     */
    const addChangedPartsToDatabase = useCallback(
        async (parts: InventoryPart[]): Promise<APIResponse> => {
            setIsLoading(true);
            setError(null);

            try {
                const res = await fetch("/api/parts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parts),
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

    return { addChangedPartsToDatabase, isLoading, error };
}
