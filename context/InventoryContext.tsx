// InventoryContext.tsx
// This context handles the providing information about inventory context throughout the entire app.

'use client';

import React, {createContext, useState, useContext, useEffect, useMemo} from "react";
import {InventoryCategory, InventoryPart} from "@/app/types/InventoryPart";
import {usePartInventory} from "@/lib/hooks/usePartInventory";
import {usePartCategories} from "@/lib/hooks/usePartCategories";

// Defining the data the context provides
interface InventoryContextType {
    // Current inventory provides the state of the currently rendered inventory.
    currentInventory: InventoryPart[];
    setCurrentInventory: React.Dispatch<React.SetStateAction<InventoryPart[]>>;

    // Edited inventory holds the user's desired changes to the database.
    editedInventory: InventoryPart[];
    setEditedInventory: React.Dispatch<React.SetStateAction<InventoryPart[]>>;

    // Stores the difference between queried/cached data (source of truth) and user-editied database
    summaryOfPartChanges: InventoryPart[];

    // Current category provides the state of the currently rendered category.
    currentCategories: InventoryCategory[];
    setCurrentCategories: React.Dispatch<React.SetStateAction<InventoryCategory[]>>;

    // Searchbar data
    searchBarQuery: string;
    setSearchBarQuery: React.Dispatch<React.SetStateAction<string>>;

    // Category data
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
}

// Default values to return if context is called outside of provider
const DefaultInventoryContext: InventoryContextType = {
    currentInventory: [],
    setCurrentInventory: () => {
        console.warn("setCurrentInventory called outside provider.");
    },
    editedInventory: [],
    setEditedInventory: () => {
        console.warn("setEditedInventory called outside provider.");
    },
    summaryOfPartChanges: [],
    currentCategories: [],
    setCurrentCategories: () => {
        console.warn("setCurrentCategories called outside provider.");
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
    const [currentInventory, setCurrentInventory] = useState<InventoryPart[]>([]);
    const [editedInventory, setEditedInventory] = useState<InventoryPart[]>([]);
    const [currentCategories, setCurrentCategories] = useState<InventoryCategory[]>([]);
    const [searchBarQuery, setSearchBarQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("None");

    // Hooks
    const {inventoryData} = usePartInventory();
    const {categoryData} = usePartCategories();

    // NOTE: inventoryData is the data from the cache or queried. currentInventory is the current react state we
    //   interact with.
    useEffect(() => {
        console.log("INFO: Seeding local copies with queried/cached data...");
        setCurrentInventory(inventoryData);
        setEditedInventory(inventoryData);
        setCurrentCategories(categoryData);
    }, [inventoryData])

    // Calculate the difference between current and edited data
    const summaryOfPartChanges = useMemo<InventoryPart[]>(() => {
        // Make a hashmap of the data queried/cached
        const origMap = Object.fromEntries(
            currentInventory.map(p => [p.sku, p])
        );

        // Return an array of inventory parts where
        return editedInventory.filter(part => {
            const orig = origMap[part.sku];  // O(1) look-up time
            return orig && orig.quantity !== part.quantity;  // Show parts with differing quantities
        });
    }, [editedInventory, currentInventory]);

    return (
        <InventoryContext.Provider value={{
            currentInventory,
            setCurrentInventory,
            editedInventory,
            setEditedInventory,
            summaryOfPartChanges,
            currentCategories,
            setCurrentCategories,
            searchBarQuery,
            setSearchBarQuery,
            selectedCategory,
            setSelectedCategory,
        }}>
            {children}
        </InventoryContext.Provider>
    );
}

export function useInventoryContext() {
    return useContext(InventoryContext);
}
