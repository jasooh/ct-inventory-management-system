// PartCard.tsx
// This component renders a card component for parts in the inventory.

'use client';

import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge";
import {InventoryPart} from "@/app/types/InventoryPart";
import {Skeleton} from "@/components/ui/skeleton";
import {useUser} from "@stackframe/stack";
import {MinusIcon, PlusIcon} from "@heroicons/react/16/solid";
import {useEffect, useState} from "react";
import {useInventoryContext} from "@/context/InventoryContext";

export default function PartCard({part}: { part: InventoryPart }) {
    const user = useUser();
    const inventory = useInventoryContext();

    const [showEditMode, setShowEditMode] = useState(false);
    const handleOnClick = () => setShowEditMode(!showEditMode);
    const handleOnCancel = () => setShowEditMode(false);

    // ADD/SUBTRACT OPERATIONS - these edit a local dictionary that is later used to mutate the database.
    // TODO: Might move these to a hook for organization if it gets more messy
    const handleOnAdd = () => {
        const currentPart = inventory.editedInventory[part.sku] ?? part;  // Check if a part is in the edited list
        const editedPart: InventoryPart = {
            ...currentPart,
            quantity: currentPart.quantity + 1,
        }

        if (editedPart.quantity + 1 != part.quantity) {
            inventory.setEditedInventory({
                ...inventory.editedInventory,
                [part.sku]: editedPart
            })
        } else {
            const updated = { ...inventory.editedInventory }
            delete updated[part.sku]
            inventory.setEditedInventory(updated)
        }
    }

    const handleOnSubtract = () => {
        const currentPart = inventory.editedInventory[part.sku] ?? part;
        const diff = currentPart.quantity - 1 >= 0 ? currentPart.quantity - 1 : currentPart.quantity;
        const editedPart: InventoryPart = {
            ...currentPart,
            quantity: diff,
        }

        if (diff != part.quantity) {
            inventory.setEditedInventory({
                ...inventory.editedInventory,
                [part.sku]: editedPart
            })
        } else {
            const updated = { ...inventory.editedInventory }
            delete updated[part.sku]
            inventory.setEditedInventory(updated)
            console.log("Duplicate, removing...");
        }
    }

    /**
     * Renders the edit buttons.
     */
    function EditButtonView() {
        return (
            <div className="w-full">
                {showEditMode ? (
                    <div className="flex flex-row items-center justify-between">
                        <Button className="rounded-r-none" onClick={handleOnSubtract}>
                            <MinusIcon className="size-4" />
                        </Button>
                        <Button className="grow rounded-none" variant="outline" onClick={handleOnCancel}>Cancel</Button>
                        <Button className="rounded-l-none" onClick={handleOnAdd}>
                            <PlusIcon className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" className="w-full" onClick={handleOnClick}>Edit</Button>
                )}
            </div>
        )
    }

    return (
        <Card className="w-full max-w-xs flex flex-col justify-between">
            <CardHeader>
                <Skeleton className="w-full h-[200px]" /> {/* TODO: Placeholder image, retrieve from S3 */}
            </CardHeader>
            <CardContent>
                <div className="relative flex flex-col gap-2">
                    <CardDescription className="w-full">{part.sku}</CardDescription>
                    <CardTitle className="w-5/6">{part.name}</CardTitle>
                    <Badge className="absolute right-0 top-0" variant="secondary">{part.quantity}</Badge>
                    <Badge>{part.category_name}</Badge>
                </div>
            </CardContent>
            <CardFooter className={`flex-col gap-2 ${user && "pb-6"}`}>
                {user && (
                    <EditButtonView />
                )}
            </CardFooter>
        </Card>
    )
}
