// EditSummaryView.tsx
// This component renders a modal that confirms if the user wants to modify the database.

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {PencilSquareIcon} from "@heroicons/react/16/solid";
import {useInventoryContext} from "@/context/InventoryContext";
import EditPartRowView from "@/components/EditPartRowView";
import ErrorText from "@/components/ErrorText";
import {addPartsToInventory} from "@/lib/api/addPartsToInventory";
import {useState} from "react";
import {toast} from "sonner";
import {cacheParts} from "@/lib/localstorage";

export function EditSummaryView() {
    const {currentInventory, editedInventory, setEditedInventory} = useInventoryContext();
    const editedLength = Object.keys(editedInventory).length;
    const canRenderEdits = editedLength > 0;

    // Component state
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const editedInventoryLength = Object.keys(editedInventory).length;

        // TODO: we have to convert this to an array because of a type mismatch between editedInventory
        //  (Record<string, InventoryPart> and the currentInventory (InventoryPart[]) - this should not be the case
        const newEditedInventory = Object.values(editedInventory);

        setLoading(true);
        try {
            await addPartsToInventory(newEditedInventory).then();
        } catch (err) {
            console.error(err);
        } finally {
            console.log("INFO: Updated items to database.");
            toast("Changes have been successfully committed!", {
                position: "top-center",
                description: `Updated ${editedInventoryLength} item(s).`,
            })
            setEditedInventory({}); // TODO: This is bad practice. We want to only remove SUCCESSFUL writes.
            setOpen(false);
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    {Object.keys(editedInventory).length > 0 && (
                        <Button className="absolute bottom-5 right-5" variant="outline">
                            <PencilSquareIcon className="size-4"/>
                        </Button>
                    )}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Commit changes</DialogTitle>
                        <DialogDescription>
                            Confirm your updates to the inventory.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="h-[200px] overflow-y-scroll grid gap-4 px-10">
                        {canRenderEdits ? (
                            Object.entries(editedInventory).map(([partSKU, partToBeEdited]) => (
                                <EditPartRowView
                                    partToBeEdited={partToBeEdited}
                                    canRenderEdits={canRenderEdits}
                                    key={partSKU}
                                />
                            ))
                        ) : (
                            <ErrorText isError={false}
                                       text="There are no parts left to edit. Please try again with changes."/>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button disabled={!canRenderEdits || loading} type="submit" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
