// addPartsToInventory.ts
// Custom hook for committing edited inventory changes.

import {InventoryPart} from "@/app/types/InventoryPart";
import {APIResponse} from "@/app/types/APIResponse";
import {useCallback, useState} from "react";
import {useUser} from "@stackframe/stack";

export function useEditPartsInInventory() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // require Stack Auth user on the client before hitting API
    const user = useUser();
    const ensureSignedIn = useCallback(() => {
        if (!user) {
            setIsLoading(false);
            throw new Error("You must be signed in to perform this action.");
        }
    }, [user]);

    /**
     * Mutates the inventory database with the changed items.
     */
    const addChangedPartsToDatabase = useCallback(
        async (parts: InventoryPart[]): Promise<APIResponse> => {
            setIsLoading(true);
            setError(null);
            ensureSignedIn();

            try {
                const res = await fetch("/api/parts", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(parts),
                });
                if (!res.ok) {
                    throw new Error(`${res.status} — PUT failed. Please try again.`);
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
