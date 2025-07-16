// part.ts
// An interface defining the fields of a part record in our SQL database.

export interface Part {
    sku: String;
    name: String;
    category_name: String;
    quantity: number;
    price_cad: number;
}