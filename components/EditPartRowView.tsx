// EditPartRowView.tsx
// This component renders a row in the edit summary modal.

import {InventoryPart} from "@/app/types/InventoryPart";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useInventoryContext} from "@/context/InventoryContext";
import {Badge} from "@/components/ui/badge";

export default function EditPartRowView({partToBeEdited, canRenderEdits}: {
    partToBeEdited: InventoryPart,
    canRenderEdits: boolean,
}) {
    // Context
    const {currentInventory, setEditedInventory} = useInventoryContext();

    // Helper methods
    /**
     * Handle deleting an item from the edit summary
     */
    const handleRevertPart = () => {
        const origPart = currentInventory.find(partInInventory => partInInventory.sku === partInInventory.sku);
        if (origPart) {
            setEditedInventory(prev =>
                prev.map(partInEditedInventory =>
                    partInEditedInventory.sku == partToBeEdited.sku ?
                        {...partInEditedInventory, quantity: origPart.quantity} :  // revert to old value
                        partInEditedInventory  // otherwise leave alone and move on
                )
            )
        }
    }

    // Component rendering
    return (
        <div
            className="w-full h-[100px] grid grid-cols-[100px_1fr_1fr_100px] gap-5 place-items-center rounded-md shadow-sm">
            <Skeleton className="size-full rounded-r-none"/>
            <section>
                <Label>{partToBeEdited.name}</Label>
                <Label className="text-sm text-gray-500 italic">{partToBeEdited.sku}</Label>
            </section>
            <Badge className="size-6" variant="secondary">{partToBeEdited.quantity}</Badge>
            <Button disabled={!canRenderEdits} variant="destructive" onClick={handleRevertPart}>Remove</Button>
        </div>
    )
}