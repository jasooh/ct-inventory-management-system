//

import {neon} from "@neondatabase/serverless";
import {InventoryCategory} from "@/app/types/InventoryPart";
import {NextResponse} from "next/server";

export async function GET(){
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`SELECT categories.category_name FROM categories`;

    const formattedData: InventoryCategory[] = data.map(row => ({
        category_name: row.category_name,
    }))

    return NextResponse.json({ formattedData }, { status: 200 });
}