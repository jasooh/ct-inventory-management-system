// addPartsToInventory.ts
// Calls the POST request to add items from the edited item list to the database.

import {InventoryPart} from "@/app/types/InventoryPart";

export async function addPartsToInventory(parts: InventoryPart[]) {
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
