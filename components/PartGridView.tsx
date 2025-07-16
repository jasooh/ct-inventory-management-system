'use client';

import {useEffect, useState} from "react";
import {Part} from "@/app/types/part";
import {Skeleton} from "@/components/ui/skeleton";
import PartCard from "@/components/PartCard";

export default function PartGridView() {
    // Component state
    const [isLoading, setIsLoading] = useState(false);
    const [inventoryData, setInventoryData] = useState<Part[]>([]);

    // Retrieve data on render
    // useEffect(() => {
    //     setIsLoading(true);
    //     console.log("DEBUG: Retrieving part data...")
    //     fetch('/api/parts')
    //         .then(res => {
    //             if (!res.ok) throw new Error(`${res.status} ERROR: Unable to fetch parts`);
    //             return res.json() as Promise<Part[]>
    //         })
    //         .then(data => setInventoryData(data))
    //         .catch(err => console.error(err))
    //         .finally(() => setIsLoading(false));
    // }, []);

    return isLoading ? <Skeleton className="h-[125px] w-[250px] rounded-xl" /> : (
        <article>
            <section className="grid grid-cols-4 gap-2">
                {inventoryData.map((partInInventory, index) => (
                    <PartCard part={partInInventory} key={index}/>
                ))}
            </section>
        </article>
    );
}