// PartGridView.tsx
// Renders the inventory as a grid of PartCard components.

'use client';

import {Skeleton} from "@/components/ui/skeleton";
import PartCard from "@/components/PartCard";
import {usePartInventory} from "@/lib/hooks/usePartInventory";
import {Label} from "@/components/ui/label";
import {ExclamationTriangleIcon} from "@heroicons/react/16/solid";

export default function PartGridView() {
    // Component state
    const {inventoryData, isLoading, error} = usePartInventory();

    /**
     * Renders the error text message used by the `PartGridView` component.
     *
     * @param text The error text to be displayed.
     */
    function ErrorText({text}: { text: string }) {
        return (
            <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
                <ExclamationTriangleIcon className="size-10 text-red-500" />
                <Label className="text-xl font-bold">ERROR</Label>
                <Label className="text-sm font-light text-gray-700">
                    {text ? text : "Please try again later."}
                </Label>
            </div>
        )
    }

    // Component UI
    return isLoading ? <Skeleton className="w-full h-full rounded-xl"/> : (
        <article className="h-full overflow-y-scroll">
            {(error && inventoryData != null) && <ErrorText text={error.message}/>}
            {inventoryData ? (
                <section className="grid grid-cols-4 gap-2 overflow-y-auto">
                    {
                        inventoryData.map((partInInventory, index) => (
                            <PartCard part={partInInventory} key={index}/>
                        ))
                    }
                </section>
            ) : (
                <ErrorText text="Inventory could not be found."/>
            )}
        </article>
    );
}