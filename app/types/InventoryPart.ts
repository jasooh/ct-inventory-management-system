// InventoryTypes.ts
// An interface defining the fields of a part record in our SQL database.

export interface InventoryPart {
    sku: String;
    name: String;
    category_name: String;
    quantity: number;
    price_cad: number;
}

export interface InventoryCategory {
    category_name: string;
}