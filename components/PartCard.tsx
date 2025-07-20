// PartCard.tsx
// This component renders a card component for parts in the inventory.

import {Button} from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge";
import {InventoryPart} from "@/app/types/InventoryPart";
import {Skeleton} from "@/components/ui/skeleton";

export default function PartCard({part}: { part: InventoryPart }) {
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
            <CardFooter className="flex-col gap-2">
                <Button variant="outline" className="w-full">
                    Add
                </Button>
            </CardFooter>
        </Card>
    )
}
