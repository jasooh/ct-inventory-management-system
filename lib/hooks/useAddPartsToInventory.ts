// useAddPartsToInventory.ts
// Custom hook for adding new inventory items.

import {useCallback, useState} from "react"
import {InventoryPart} from "@/app/types/InventoryPart"
import {APIResponse} from "@/app/types/APIResponse"

export function useAddPartsToInventory() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<Error | null>(null)

    /**
     * Mutates the inventory database with the changed items.
     */
    const addNewPartsToDatabase = useCallback(
        async (newPart: InventoryPart): Promise<APIResponse> => {
            setIsLoading(true)
            setError(null)

            try {
                const res: Response = await fetch("/api/parts", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(newPart),
                })
                if (!res.ok) {
                    throw new Error(`${res.status} — POST failed. Please try again.`)
                }
                return (await res.json()) as APIResponse
            } catch (err) {
                setError(err as Error)
                throw err
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    const addNewImageToS3 = useCallback(
        async (image_key: string, imageToUpload: File) => {
            try {
                const res: Response = await fetch("/api/parts/images", {
                    method: "POST",
                    headers: {"Content-Type": "text/plain"},
                    body: image_key,
                })

                if (!res.ok) {
                    throw new Error(`${res.status} — S3 request failed. Please try again.`)
                }

                const { uploadUrl, downloadUrl } = await res.json()

                const uploadRes = await fetch(uploadUrl, {
                    method: "PUT",
                    headers: { "Content-Type": imageToUpload.type },
                    body: imageToUpload,
                });
                if (!uploadRes.ok) {
                    throw new Error(`Upload to S3 failed: ${uploadRes.status}`);
                }

                return downloadUrl;
            } catch (err) {
                setError(err as Error)
                throw err
            }
        },
        []
    )

    return {addNewPartsToDatabase, addNewImageToS3, isLoading, error}
}