// AddCategorySelector.tsx
// Renders the category selector for adding and selecting inventory categories
// TODO: add new categories

import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {Dispatch, SetStateAction} from "react";
import {DropdownMenuRadioGroup, DropdownMenuRadioItem} from "@stackframe/stack-ui";
import {useInventoryContext} from "@/context/InventoryContext";

export function AddCategorySelector({value, action}: { value: string; action: Dispatch<SetStateAction<string>> }) {
    const {currentCategories} = useInventoryContext();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">{value}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuRadioGroup value={value} onValueChange={action}>
                    {
                        currentCategories.map((categoryType, index) => (
                            <DropdownMenuRadioItem key={index} value={categoryType.category_name}>
                                {categoryType.category_name}
                            </DropdownMenuRadioItem>
                        ))
                    }
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Add new category</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
