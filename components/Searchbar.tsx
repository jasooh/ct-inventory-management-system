// Searchbar.tsx
// This component renders the inventory search bar.

import {Input} from "@/components/ui/input";
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";
import {useInventoryContext} from "@/context/InventoryContext";

export default function Searchbar() {
    const {searchBarQuery, setSearchBarQuery} = useInventoryContext();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchBarQuery(e.target.value);

    return (
        <div className="relative w-full">
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 size-4 pointer-events-none"/>
            <Input onChange={handleChange} className="my-4" type="text" placeholder="Search inventory..."/>
        </div>
    )
}