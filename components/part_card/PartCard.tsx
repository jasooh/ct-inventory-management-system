// PartCard.tsx
// This component renders a card component for parts in the inventory.

'use client';

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
import EditButton from "@/components/part_card/EditButton";
import Image from "next/image";
import PartImage from "@/components/PartImage";

export default function PartCard({part}: { part: InventoryPart }) {
    // Context
    const user = useUser();

    return (
        // TODO: cards do not adapt when zooming out
        <Card className="w-full max-w-xs flex flex-col justify-between">
            <CardHeader className="flex justify-center items-center">
                <div className="relative aspect-[1/1] w-full">
                    <PartImage part={part} />
                </div>
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
                    <EditButton {...part} />
                )}
            </CardFooter>
        </Card>
    )
}
