// This endpoint retrieves all current categories.
// Endpoint: /api/parts/categories

import {neon} from "@neondatabase/serverless";
import {InventoryCategory} from "@/app/types/InventoryPart";
import {NextResponse} from "next/server";
import {getUserIP} from "@/project-utils/getUserIP";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {appConstants} from "@/lib/appConstants";

const rateLimiter = new RateLimiterMemory({
    points: appConstants.CACHE_CALL_LIMIT as number | undefined,
    duration: getTimeFromMinutes(
        appConstants.CACHE_DEBOUNCE_IN_MINUTES,
        conversionTypes.toSeconds
    )
})

export async function GET(){
    // Rate limit the request
    const userIP = await getUserIP();
    try {
        await rateLimiter.consume(userIP, 1);
    } catch {
        return NextResponse.json({ message: "Too many requests." }, { status: 429 })
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`SELECT categories.category_name, categories.id FROM categories`;

    const formattedData: InventoryCategory[] = data.map(row => ({
        category_name: row.category_name,
        id: row.id,
    }))

    return NextResponse.json(formattedData, { status: 200 });
}