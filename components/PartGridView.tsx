// PartGridView.tsx
// Renders the inventory as a grid of PartCard components.

'use client';

import {Skeleton} from "@/components/ui/skeleton";
import PartCard from "@/components/PartCard";
import {usePartInventory} from "@/lib/hooks/usePartInventory";
import ErrorText from "@/components/ErrorText";
import {useInventoryContext} from "@/context/InventoryContext";
import {useEffect} from "react";

export default function PartGridView() {
    const inventoryContext = useInventoryContext();
    // Component state
    const {inventoryData, isLoading, error} = usePartInventory();
    // Update context on component mount
    useEffect(() => inventoryContext.setCurrentInventory(inventoryData), [inventoryData]);

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