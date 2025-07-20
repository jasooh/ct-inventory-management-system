// ErrorText.tsx
// Renders the error text for the inventory page.

import {ExclamationCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/16/solid";
import {Label} from "@/components/ui/label";

/**
 * Renders the error text message used by the `PartGridView` component.
 *
 * @param text The error text to be displayed.
 * @param isError Changes the icon depending on if the text is an error or not.
 */
export default function ErrorText({text, isError = true}: { text: string, isError?: boolean }) {
    return (
        <div className="flex items-center justify-center flex-col gap-2 w-full h-full">
            {isError ? (<ExclamationTriangleIcon className="size-10 text-red-500"/>) : (<ExclamationCircleIcon className="size-10"/>)}

            <Label className="text-xl font-bold">{isError ? "ERROR" : "WARNING"}</Label>
            <Label className="text-sm font-light text-gray-700 dark:text-gray-100">
                {text ? text : "Please try again later."}
            </Label>
        </div>
    )
}