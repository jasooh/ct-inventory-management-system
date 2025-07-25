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
import {SkuInput} from "@/components/add_part/SkuInput";
import {AddCategorySelector} from "@/components/add_part/AddCategorySelector";

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
    const [category, setCategory] = useState<string>("None");
    const [quantity, setQuantity] = useState<number>(0);
    const [price, setPrice] = useState<number>(0);
    const [image, setImage] = useState<File | null>(null);

    // Form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formattedSku: string = `${sku.slice(0, 3)}-${sku.slice(3)}`
        const formattedImageKey: string | null = image ? `${formattedSku}_${image.name}` : null;

        const partToAdd: InventoryPart = {
            sku: formattedSku,
            name: name,
            category_name: category,
            quantity: quantity,
            price_cad: price,
            image_key: formattedImageKey,
            signed_url: null
        }

        console.log(partToAdd);

        try {
            const res = await addNewPartsToDatabase(partToAdd)
            if (res.success) {
                toast(`Your new part, ${partToAdd.name}, has been added successfully!`, {
                    position: "top-center",
                    description: partToAdd.sku,
                    icon: <CheckCircleIcon className="text-green-300"/>
                })
                setOpen(false)
                setCurrentInventory(editedInventory)  // Making the new source of truth our successful changes
                cacheParts(editedInventory)  // Cache the changes locally so we don't have to re-query
            } else {
                toast("Request was unsuccessful. Please try again.", {
                    position: "top-center",
                    description: `${res.error}`,
                    icon: <ExclamationCircleIcon className="text-destructive"/>
                })
            }
        } catch (error) {
            toast("An unexpected error has occurred.", {
                position: "top-center",
                description: `${error}`,
                icon: <ExclamationCircleIcon className="text-destructive"/>
            })
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form onSubmit={handleSubmit}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        <PlusIcon className="size-4"/> Add Part
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px]">
                    <DialogHeader>
                        <DialogTitle>Add New Part</DialogTitle>
                        <DialogDescription>
                            Create a new part to add to the database.
                        </DialogDescription>
                    </DialogHeader>
                    <section className="grid grid-cols-2 gap-4">
                        <div className="grid gap-3">
                            <Label>SKU</Label>
                            <SkuInput value={sku} action={setSku}/>
                        </div>
                        <div className="grid gap-3">
                            <Label>Name</Label>
                            <Input
                                name="name"
                                onChange={e => setName(e.target.value)}
                                required
                            />
                        </div>
                        {/* TODO: make category selector and a separate tab to make your own categories */}

                        <div className="grid gap-3">
                            <Label>Category</Label>
                            <AddCategorySelector value={category} action={setCategory} />
                            {/*<Input*/}
                            {/*    name="category"*/}
                            {/*    onChange={e => setCategory(e.target.value)}*/}
                            {/*    required*/}
                            {/*/>*/}
                        </div>
                        <div className="grid gap-3">
                            <Label>Quantity</Label>
                            <Input
                                name="quantity"
                                type="number"
                                onChange={e => setQuantity(parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label>Price (CAD)</Label>
                            <Input
                                name="price"
                                type="number"
                                onChange={e => setPrice(parseInt(e.target.value))}
                                required
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label>Image</Label>
                            <Input
                                name="image"
                                type="file"
                                accept="image/*"
                                className="size-full"
                                onChange={e => setImage(e.target.files?.[0] ?? null)}
                                required
                            />
                        </div>
                    </section>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}