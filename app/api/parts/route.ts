// This endpoint retrieves part data based on category ID.
// Endpoint: /api/parts

import {neon} from '@neondatabase/serverless';
import {NextResponse} from "next/server";
import {InventoryPart} from "@/app/types/InventoryPart";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {getUserIP} from "@/project-utils/getUserIP";
import {appConstants} from "@/lib/appConstants";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {useStackApp} from "@stackframe/stack";

const rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toSeconds)
})

// TODO: 19/07/25 - triggering the rate limit and invalidating the local cache will cause the ui to return an error
//                  rather than just looking into the cache we have, should fix but not a problem right now
// TODO: handle errors better here
export async function GET(): Promise<Response> {
    // Rate limit the request
    const userIP = await getUserIP();
    try {
        await rateLimiter.consume(userIP, 1);
    } catch {
        return NextResponse.json({message: "Too many requests."}, {status: 429})
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

    return NextResponse.json(formattedData, {status: 200});
}

export async function POST(req: Request) {
    const parts: InventoryPart[] = await req.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    const app = useStackApp();
    const user = await app.getUser()

    if (user) { // TODO: Verify if this works with Postman
        for (const part of parts) {
            await sql`
            UPDATE parts
            SET quantity = ${part.quantity}
            WHERE sku = ${part.sku};
        `;
        }

        return NextResponse.json({success: true}, {status: 200});
    } else {
        return NextResponse.json({success: false}, {status: 401});
    }
}