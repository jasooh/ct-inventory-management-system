// addPartsToInventory.ts
// Calls the POST request to add items from the edited item list to the database.

import {InventoryPart} from "@/app/types/InventoryPart";
import {useStackApp} from "@stackframe/stack";

export async function addPartsToInventory(parts: InventoryPart[]) {
    const app = useStackApp()
    const user = await app.getUser()
    if (user) {
        const res = await fetch('/api/parts', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(parts),
        });

        if (!res.ok) {
            throw new Error('Failed to update parts');
        }

        return res.json();
    }
}
