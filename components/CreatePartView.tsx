// CreatePartButton.tsx
// This component renders the create part button.

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
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {CheckCircleIcon, ExclamationCircleIcon, PlusIcon} from "@heroicons/react/16/solid";
import {useState} from "react";
import {useAddPartsToInventory} from "@/lib/hooks/useAddPartsToInventory";
import {InventoryPart} from "@/app/types/InventoryPart";
import {toast} from "sonner";
import {cacheParts} from "@/lib/localstorage";
import {useInventoryContext} from "@/context/InventoryContext";

export default function CreatePartView() {
    // Context
    const {editedInventory, setCurrentInventory} = useInventoryContext()

    // Hooks
    const {addNewPartsToDatabase, isLoading, error} = useAddPartsToInventory();

    // Component state
    const [open, setOpen] = useState(false);

    // Form fields
    const [sku, setSku] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);

    // Form
    const handleSubmit = async (e: React.FormEvent)=> {
        e.preventDefault();

        const partToAdd: InventoryPart = {
            sku: sku,
            name: name,
            category_name: category,
            quantity: quantity,
            price_cad: price,
            image_key: null,
            signed_url: null
        }

        try {
            const res = await addNewPartsToDatabase(partToAdd)
            if (res.success) {
                toast(`Your new part, ${partToAdd.name}, has been added successfully!`, {
                    position: "top-center",
                    description: partToAdd.sku,
                    icon: <CheckCircleIcon className="text-green-300" />
                })
                setOpen(false)
                setCurrentInventory(editedInventory)  // Making the new source of truth our successful changes
                cacheParts(editedInventory)  // Cache the changes locally so we don't have to re-query
            } else {
                toast("Request was unsuccessful. Please try again.", {
                    position: "top-center",
                    description: `${res.error}`,
                    icon: <ExclamationCircleIcon className="text-destructive" />
                })
            }
        } catch (error) {
            toast("An unexpected error has occurred.", {
                position: "top-center",
                description: `${error}`,
                icon: <ExclamationCircleIcon className="text-destructive" />
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusIcon className="size-4" /> Add Part
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <DialogTitle>Add New Part</DialogTitle>
                        <DialogDescription>
                            Create a new part to add to the database.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">SKU</Label>
                            <Input id="name-1" name="name" required />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Name</Label>
                            <Input id="username-1" name="username" required />
                        </div>
                        <div className="grid gap-3">
                            {/* TODO: make category selector and a separate tab to make your own categories */}
                            <Label htmlFor="username-1">Category</Label>
                            <Input id="username-1" name="username" required />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}