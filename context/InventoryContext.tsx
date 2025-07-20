// InventoryContext.tsx
// This context handles the providing information about inventory context throughout the entire app.

'use client';

import React, { createContext, useState, useContext } from "react";
import { InventoryPart } from "@/app/types/InventoryPart";

// Defining the data the context provides
interface InventoryContextType {
    editedInventory: Record<string, InventoryPart>;
    setEditedInventory: React.Dispatch<React.SetStateAction<Record<string, InventoryPart>>>;
}

// Default values to return if context is called outside of provider
const DefaultInventoryContext: InventoryContextType = {
    editedInventory: {},
    setEditedInventory: () => {
        console.warn("setEditedInventory called outside provider.");
    },
};

const InventoryContext = createContext<InventoryContextType>(DefaultInventoryContext);

export function InventoryContextProvider({ children }: { children: React.ReactNode }) {
    const [editedInventory, setEditedInventory] = useState<Record<string, InventoryPart>>({});

    return (
        <InventoryContext.Provider value={{ editedInventory, setEditedInventory }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventoryContext() {
    return useContext(InventoryContext);
}
