// PartImage
// This component is responsible for rendering the images for a part.

import Image from "next/image";
import {Skeleton} from "@/components/ui/skeleton";
import {InventoryPart} from "@/app/types/InventoryPart";

export default function PartImage({part, className}: {part: InventoryPart, className?: string}) {
    return part?.signed_url ? (
        <Image
            src={part.signed_url}
            alt={part.name}
            fill
            className={`rounded-md ${className}`}
        />
    ) : (
        <Skeleton className={`size-full ${className}`} />
    )
}