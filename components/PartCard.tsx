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
import {useState} from "react";
import {Label} from "@/components/ui/label";
import {useInventoryContext} from "@/context/InventoryContext";

export default function PartCard({part}: { part: InventoryPart }) {
    const user = useUser();
    const inventory = useInventoryContext();

    const [showEditMode, setShowEditMode] = useState(false);
    const handleOnClick = () => setShowEditMode(!showEditMode);
    const handleOnCancel = () => setShowEditMode(false);

    // TODO: Might move these to a hook for organization
    const handleOnAdd = () => {
        const editedPart: InventoryPart = {
            ...part,
            quantity: part.quantity + 1,
        }
        inventory.setEditedInventory([...inventory.editedInventory, editedPart]);
    }

    const handleOnSubtract = () => {
        const editedPart: InventoryPart = {
            ...part,
            quantity: part.quantity - 1,
        }
        inventory.setEditedInventory([...inventory.editedInventory, editedPart]);
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
