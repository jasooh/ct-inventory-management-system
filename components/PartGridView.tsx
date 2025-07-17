// PartGridView.tsx
// Renders the inventory as a grid of PartCard components.

'use client';

import {useEffect, useState} from "react";
import {Part} from "@/app/types/part";
import {Skeleton} from "@/components/ui/skeleton";
import PartCard from "@/components/PartCard";
import {usePartInventory} from "@/lib/hooks/usePartInventory";

export default function PartGridView() {
    // Component state
    const { inventoryData, isLoading, error } = usePartInventory();

    // Component UI
    return isLoading ? <Skeleton className="w-full h-full rounded-xl"/> : (
        <article className="overflow-y-scroll">
            <section className="grid grid-cols-4 gap-2 overflow-y-auto">
                {inventoryData ? (
                    inventoryData.map((partInInventory, index) => (
                        <PartCard part={partInInventory} key={index}/>
                    ))
                ) : (
                    <div>Inventory is null :(</div>
                )}
            </section>
        </article>
    );
}