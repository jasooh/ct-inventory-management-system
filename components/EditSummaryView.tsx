// EditSummaryView.tsx
// This component renders a modal that confirms if the user wants to modify the database.

import {Button} from "@/components/ui/button"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet"
import {PencilSquareIcon} from "@heroicons/react/16/solid"
import {useInventoryContext} from "@/context/InventoryContext"
import EditPartRowView from "@/components/EditPartRowView"
import ErrorText from "@/components/ErrorText"
import {useAddPartsToInventory} from "@/lib/hooks/useAddPartsToInventory"
import {useState} from "react"
import {toast} from "sonner"
import {Label} from "@/components/ui/label";
import {cacheParts} from "@/lib/localstorage";

export function EditSummaryView() {
    const {editedInventory, summaryOfPartChanges} = useInventoryContext()
    const {addChangedPartsToDatabase, isLoading} = useAddPartsToInventory()

    const [open, setOpen] = useState(false)

    const canRenderEdits = summaryOfPartChanges.length > 0

    const handleSubmit = async () => {
        try {
            const res = await addChangedPartsToDatabase(summaryOfPartChanges)
            if (res.success) {
                toast("Changes have been successfully committed!", {
                    position: "top-center",
                    description: `Updated ${summaryOfPartChanges.length} item(s).`,
                })
                setOpen(false)
                cacheParts(editedInventory)  // Cache the changes locally so we don't have to re-query
            } else {
                toast("Request was unsuccessful. Please try again.", {
                    position: "top-center",
                    description: `ERROR: ${res.error}`,
                })
            }
        } catch (error) {
            toast("An unexpected error has occurred.", {
                position: "top-center",
                description: `ERROR: ${error}`,
            })
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {canRenderEdits && (
                    <Button className="absolute bottom-5 right-5" variant="outline">
                        <PencilSquareIcon className="size-4"/>
                        <Label>View changes</Label>
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[600px]">
                <form
                    className="h-full flex flex-col justify-between px-2"
                >
                    <SheetHeader>
                        <SheetTitle>Commit changes</SheetTitle>
                        <SheetDescription>
                            Confirm your updates to the inventory.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="h-full overflow-y-scroll p-2">
                        {canRenderEdits ? (
                            summaryOfPartChanges).map((part) => (
                                <EditPartRowView
                                    key={part.sku}
                                    partToBeEdited={part}
                                    canRenderEdits={canRenderEdits}
                                />
                            )
                        ) : (
                            <ErrorText
                                isError={false}
                                text="There are no parts left to edit. Please try again with changes."
                            />
                        )}
                    </div>

                    <SheetFooter>
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button disabled={!canRenderEdits || isLoading} type="submit" onClick={handleSubmit}>
                            {isLoading ? "Saving..." : "Save changes"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
