// Searchbar.tsx
// This component renders the inventory search bar.

import {Input} from "@/components/ui/input";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

export default function Searchbar() {

    return (
        <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none" />
            <Input className="my-4" type="search" placeholder="Search inventory..." />
        </div>
    )
}