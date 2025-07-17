// This endpoint retrieves part data based on category ID.
// Endpoint: /api/parts

import {neon} from '@neondatabase/serverless';
import {NextResponse} from "next/server";
import {Part} from "@/app/types/part";

export async function GET(): Promise<Response> {
    // Connect to Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
        SELECT parts.sku, parts.name, categories.category_name, parts.quantity, parts.price_cad
        FROM parts
        INNER JOIN categories ON parts.category_id = categories.id
    `;

    const formattedData: Part[] = data.map(row => ({
        sku: row.sku,
        name: row.name,
        category_name: row.category_name,
        quantity: Number(row.quantity),
        price_cad: Number(row.price_cad),
    }))

    return NextResponse.json(formattedData);
}