// EditButton.tsx
// Renders the edit button inside the part cards.

import {Button} from "@/components/ui/button";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
import {useEffect, useState} from "react";
import {InventoryPart} from "@/app/types/InventoryPart";
import {useInventoryContext} from "@/context/InventoryContext";

export default function EditButton(part: InventoryPart) {
    // Inventory
    const {currentInventory, editedInventory, setEditedInventory} = useInventoryContext();

    // Component state
    const [showEditMode, setShowEditMode] = useState(false);
    const handleOnClick = () => setShowEditMode(!showEditMode);
    const handleOnCancel = () => setShowEditMode(false);

    // Helper methods
    // ADD/SUBTRACT OPERATIONS - these edit a local dictionary that is later used to mutate the database.
    const updateQuantity = (delta: number) => {
        // Find the current version (queried/cached) and the current edit version
        const base = currentInventory.find(p => p.sku === part.sku)!;
        const edited = editedInventory.find(p => p.sku === part.sku) ?? base;

        const newQty = Math.max(edited.quantity + delta, 0);

        setEditedInventory(prev =>
            prev.some(p => p.sku === part.sku)
                ? prev.map(p =>
                    p.sku === part.sku ? { ...p, quantity: newQty } : p
                )
                : [...prev, { ...base, quantity: newQty }]
        );
    };

    const handleOnAdd = () => updateQuantity(+1);
    const handleOnSubtract = () => updateQuantity(-1);

    // Component rendering
    return (
        <div className="w-full">
            {showEditMode ? (
                <div className="flex flex-row items-center justify-between">
                    <Button className="rounded-r-none" onClick={handleOnSubtract}>
                        <MinusIcon className="size-4"/>
                    </Button>
                    <Button className="grow rounded-none" variant="outline" onClick={handleOnCancel}>Cancel</Button>
                    <Button className="rounded-l-none" onClick={handleOnAdd}>
                        <PlusIcon className="size-4"/>
                    </Button>
                </div>
            ) : (
                // TODO: should rework the UI flow of this button, very clunky
                <Button variant="outline" className="w-full" onClick={handleOnClick}>Edit</Button>
            )}
        </div>
    )
}