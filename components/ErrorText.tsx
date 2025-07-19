// ErrorText.tsx
// Renders the error text for the inventory page.

import {ExclamationTriangleIcon} from "@heroicons/react/16/solid";
import {Label} from "@/components/ui/label";

/**
 * Renders the error text message used by the `PartGridView` component.
 *
 * @param text The error text to be displayed.
 */
export default function ErrorText({text}: { text: string }) {
    return (
        <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
            <ExclamationTriangleIcon className="size-10 text-red-500"/>
            <Label className="text-xl font-bold">ERROR</Label>
            <Label className="text-sm font-light text-gray-700 dark:text-gray-100">
                {text ? text : "Please try again later."}
            </Label>
        </div>
    )
}