// useAddPartsToInventory.ts
// Custom hook for adding new inventory items.

import { useCallback, useState } from "react";
import { InventoryPart } from "@/app/types/InventoryPart";
import { APIResponse } from "@/app/types/APIResponse";
import { useUser } from "@stackframe/stack";

export function useAddPartsToInventory() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // require Stack Auth user on the client before hitting API
    const user = useUser();  // TODO: verbose, move this into a new shared util folder
    const ensureSignedIn = useCallback(() => {
        if (!user) {
            setIsLoading(false);
            throw new Error("You must be signed in to perform this action.");
        }
    }, [user]);

    /**
     * Mutates the inventory database with the changed items.
     */
    const addNewPartsToDatabase = useCallback(
        async (newPart: InventoryPart): Promise<APIResponse> => {
            setIsLoading(true);
            setError(null);
            ensureSignedIn();

            try {
                const res: Response = await fetch("/api/parts", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newPart),
                });

                if (res.status === 401) {
                    throw new Error("Unauthorized — please sign in and try again.");
                }
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
        [ensureSignedIn]
    );

    const addNewImageToS3 = useCallback(
        async (image_key: string, imageToUpload: File) => {
            setIsLoading(true);
            ensureSignedIn();

            try {
                // ask backend for a presigned URL (auth required)
                const res: Response = await fetch("/api/parts/images", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "text/plain" },
                    body: image_key,
                });

                if (res.status === 401) {
                    throw new Error("Unauthorized: please sign in and try again.");
                }
                if (!res.ok) {
                    throw new Error(`${res.status}: S3 request failed. Please try again.`);
                }

                const { uploadUrl, downloadUrl } = await res.json();

                // upload to S3 using the presigned URL (no cookies/headers needed beyond Content-Type)
                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": imageToUpload.type },
                    body: imageToUpload,
                });
                if (!uploadRes.ok) {
                    setIsLoading(false);
                    throw new Error(`${uploadRes.status}: Upload to S3 failed`);
                }

                return downloadUrl as string;
            } catch (err) {
                setError(err as Error);
                throw err;
            }
        },
        [ensureSignedIn]
    );

    return { addNewPartsToDatabase, addNewImageToS3, isLoading, error };
}
