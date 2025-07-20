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
    const inventory = useInventoryContext();

    /**
     * Handle deleting an item from the edit summary
     */
    const handleDelete = () => {
        if (inventory.editedInventory[partToBeEdited.sku]) {
            const editedInventoryWithoutPart = {...inventory.editedInventory};
            delete editedInventoryWithoutPart[partToBeEdited.sku];
            inventory.setEditedInventory(editedInventoryWithoutPart);
        }
    }

    return (
        <div className="w-full h-[100px] grid grid-cols-[100px_1fr_1fr_100px] gap-5 place-items-center rounded-md shadow-sm">
            <Skeleton className="size-full rounded-r-none"/>
            <section>
                <Label>{partToBeEdited.name}</Label>
                <Label className="text-sm text-gray-500 italic">{partToBeEdited.sku}</Label>
            </section>
            <Badge className="size-6" variant="secondary">{partToBeEdited.quantity}</Badge>
            <Button disabled={!canRenderEdits} variant="destructive" onClick={handleDelete}>Remove</Button>
        </div>
    )
}