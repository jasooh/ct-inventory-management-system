// EditPartRowView.tsx
// This component renders a row in the edit summary modal.

import {InventoryPart} from "@/app/types/InventoryPart";
import {Skeleton} from "@/components/ui/skeleton";
import {Label} from "@/components/ui/label";
import {Button} from "@/components/ui/button";
import {useInventoryContext} from "@/context/InventoryContext";
import {Badge} from "@/components/ui/badge";
import {useEffect, useState} from "react";
import {ArrowRightIcon} from "@heroicons/react/16/solid";
import PartImage from "@/components/PartImage";

export default function EditPartRowView({partToBeEdited, canRenderEdits}: {
    partToBeEdited: InventoryPart,
    canRenderEdits: boolean,
}) {
    // Context
    const {currentInventory, setEditedInventory} = useInventoryContext();

    // Component state
    const [originalPartToBeEdited, setOriginalPartToBeEdited] = useState<InventoryPart>();

    useEffect(() => {
        const origPart = currentInventory.find(partInInventory => partInInventory.sku === partToBeEdited.sku);
        setOriginalPartToBeEdited(origPart);
    }, [])

    /**
     * Handles deleting an item from the edit summary
     */
    const handleRevertPart = () => {
        if (originalPartToBeEdited) {
            console.log(`edited ${originalPartToBeEdited.name}: ${originalPartToBeEdited.quantity}\ncurrent ${partToBeEdited.name}: ${partToBeEdited.quantity}`);
            setEditedInventory(prev =>
                prev.map(partInEditedInventory =>
                    partInEditedInventory.sku == partToBeEdited.sku ?
                        {...partInEditedInventory, quantity: originalPartToBeEdited.quantity} :  // revert to old value
                        partInEditedInventory  // otherwise leave alone and move on
                )
            )
        }
    }

    // Component rendering
    return (
        <div
            className="w-full h-[100px] grid grid-cols-[100px_1fr_1fr_100px] gap-5 place-items-center rounded-md shadow-sm">
            <div className="relative size-full">
                <PartImage part={partToBeEdited} className="rounded-r-none" />
            </div>
            <section>
                <Label>{partToBeEdited.name}</Label>
                <Label className="text-sm text-gray-500 italic">{partToBeEdited.sku}</Label>
            </section>
            <div className="flex flex-row items-center gap-4">
                {originalPartToBeEdited && (
                    <>
                        <Badge className="size-6" variant="secondary">{originalPartToBeEdited.quantity}</Badge>
                        <ArrowRightIcon className="size-4" />
                    </>
                )}
                <Badge className="size-6" variant="default">{partToBeEdited.quantity}</Badge>
            </div>
            <Button disabled={!canRenderEdits} variant="destructive" onClick={handleRevertPart} type="button">Revert</Button>
        </div>
    )
}