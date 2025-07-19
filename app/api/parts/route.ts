// This endpoint retrieves part data based on category ID.
// Endpoint: /api/parts

import {neon} from '@neondatabase/serverless';
import {NextResponse} from "next/server";
import {InventoryPart} from "@/app/types/InventoryPart";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {getUserIP} from "@/project-utils/getUserIP";
import {appConstants} from "@/lib/appConstants";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";

const rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toSeconds)
})

export async function GET(): Promise<Response> {
    // Rate limit the request
    const userIP = await getUserIP();
    try {
        await rateLimiter.consume(userIP, 1);
    } catch {
        return NextResponse.json({ message: "Too many requests." }, { status: 429 })
    }

    // Connect to Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
        SELECT parts.sku, parts.name, categories.category_name, parts.quantity, parts.price_cad
        FROM parts
        INNER JOIN categories ON parts.category_id = categories.id
    `;

    // Format the data for use
    const formattedData: InventoryPart[] = data.map(row => ({
        sku: row.sku,
        name: row.name,
        category_name: row.category_name,
        quantity: Number(row.quantity),
        price_cad: Number(row.price_cad),
    }))

    return NextResponse.json(formattedData, { status: 200 });
}