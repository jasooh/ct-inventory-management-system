// InventoryContext.tsx
// This context handles the providing information about inventory context throughout the entire app.

'use client';

import React, {createContext, useState, useContext} from "react";
import {InventoryCategory, InventoryPart} from "@/app/types/InventoryPart";

// Defining the data the context provides
interface InventoryContextType {
    // Edited inventory holds the user's desired changes to the database.
    editedInventory: Record<string, InventoryPart>;
    setEditedInventory: React.Dispatch<React.SetStateAction<Record<string, InventoryPart>>>;

    // Current inventory provides the state of the currently rendered inventory.
    currentInventory: InventoryPart[];
    setCurrentInventory: React.Dispatch<React.SetStateAction<InventoryPart[]>>;

    // Searchbar data
    searchBarQuery: string;
    setSearchBarQuery: React.Dispatch<React.SetStateAction<string>>;

    // Category data
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

// Default values to return if context is called outside of provider
const DefaultInventoryContext: InventoryContextType = {
    editedInventory: {},
    setEditedInventory: () => {
        console.warn("setEditedInventory called outside provider.");
    },
    currentInventory: [],
    setCurrentInventory: () => {
        console.warn("setCurrentInventory called outside provider.");
    },
    searchBarQuery: "",
    setSearchBarQuery: () => {
        console.warn("setSearchBarQuery called outside provider.");
    },
    selectedCategory: "None",
    setSelectedCategory: () => {
        console.warn("setSelectedCategory called outside provider.");
    }
};

const InventoryContext = createContext<InventoryContextType>(DefaultInventoryContext);

export function InventoryContextProvider({children}: { children: React.ReactNode }) {
    const [editedInventory, setEditedInventory] = useState<Record<string, InventoryPart>>({});
    const [currentInventory, setCurrentInventory] = useState<InventoryPart[]>([]);
    const [searchBarQuery, setSearchBarQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("None");

    return (
        <InventoryContext.Provider value={{
            editedInventory,
            setEditedInventory,
            currentInventory,
            setCurrentInventory,
            searchBarQuery,
            setSearchBarQuery,
            selectedCategory,
            setSelectedCategory
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventoryContext() {
    return useContext(InventoryContext);
}
