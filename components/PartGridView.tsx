// PartGridView.tsx
// Renders the inventory as a grid of PartCard components.

'use client';

import {Skeleton} from "@/components/ui/skeleton";
import PartCard from "@/components/part_card/PartCard";
import {usePartInventory} from "@/lib/hooks/usePartInventory";
import ErrorText from "@/components/ErrorText";
import {useInventoryContext} from "@/context/InventoryContext";
import {useEffect} from "react";

export default function PartGridView() {
    const {selectedCategory, searchBarQuery, editedInventory} = useInventoryContext();
    // Component state
    const {isLoading, error} = usePartInventory();

    return isLoading ? <Skeleton className="w-full h-full rounded-xl"/> : (
        <article className="h-full overflow-y-scroll">
            {(error && editedInventory != null) && <ErrorText text={error.message}/>}
            {editedInventory.length == 0 && (<ErrorText isError={false} text="Inventory is empty. Please add a part to continue." />)}
            {editedInventory ? (
                <section className="grid grid-cols-4 gap-2 overflow-y-auto">
                    {
                        editedInventory
                            .filter(part => {
                                const matchesCategory =
                                    selectedCategory === "None" || part.category_name === selectedCategory;

                                const matchesSearch =
                                    part.name.toLowerCase().includes(searchBarQuery.toLowerCase()) ||
                                    part.sku.toLowerCase().includes(searchBarQuery.toLowerCase());

                                return matchesCategory && matchesSearch;
                            })
                            .map((partInInventory, index) => (
                                <PartCard part={partInInventory} key={index} />
                            ))
                    }
                </section>
            ) : (
                <ErrorText text="Inventory could not be found."/>
            )}
        </article>
    );
}