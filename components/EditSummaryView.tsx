// EditSummaryView.tsx
// This component renders a modal that confirms if the user wants to modify the database.

import { Button } from "@/components/ui/button"
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { PencilSquareIcon } from "@heroicons/react/16/solid"
import { useInventoryContext } from "@/context/InventoryContext"
import EditPartRowView from "@/components/EditPartRowView"
import ErrorText from "@/components/ErrorText"
import { addPartsToInventory } from "@/lib/api/addPartsToInventory"
import { useState } from "react"
import { toast } from "sonner"
import { cacheParts } from "@/lib/localstorage"
import {Label} from "@/components/ui/label";

export function EditSummaryView() {
    const { currentInventory, editedInventory, setEditedInventory } = useInventoryContext()
    const editedLength = Object.keys(editedInventory).length
    const canRenderEdits = editedLength > 0

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        const count = Object.keys(editedInventory).length
        const updates = Object.values(editedInventory)

        setLoading(true)
        try {
            await addPartsToInventory(updates)
            toast("Changes have been successfully committed!", {
                position: "top-center",
                description: `Updated ${count} item(s).`,
            })
            cacheParts(currentInventory)
            setEditedInventory({})
            setOpen(false)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {canRenderEdits && (
                    <Button className="absolute bottom-5 right-5" variant="outline">
                        <PencilSquareIcon className="size-4" />
                        <Label>View changes</Label>
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent className="w-[600px]">
                <form
                    className="h-full flex flex-col justify-between px-2"
                    onSubmit={e => {
                        e.preventDefault()
                        handleSubmit()
                    }}
                >
                    <SheetHeader>
                        <SheetTitle>Commit changes</SheetTitle>
                        <SheetDescription>
                            Confirm your updates to the inventory.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="h-[200px] overflow-y-scroll grid gap-4 p-2">
                        {canRenderEdits ? (
                            Object.entries(editedInventory).map(([sku, part]) => (
                                <EditPartRowView
                                    key={sku}
                                    partToBeEdited={part}
                                    canRenderEdits={canRenderEdits}
                                />
                            ))
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
                        <Button disabled={!canRenderEdits || loading} type="submit">
                            {loading ? "Saving..." : "Save changes"}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    )
}
