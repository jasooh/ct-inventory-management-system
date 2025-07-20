// InventoryTypes.ts
// An interface defining the fields of a part record in our SQL database.

export interface InventoryPart {
    sku: string;
    name: string;
    category_name: string;
    quantity: number;
    price_cad: number;
}

export interface InventoryCategory {
    category_name: string;
}