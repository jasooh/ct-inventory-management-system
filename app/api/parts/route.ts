// This endpoint retrieves part data based on category ID.
// Endpoint: /api/parts

import {neon} from '@neondatabase/serverless';
import {NextResponse} from "next/server";
import {InventoryPart} from "@/app/types/InventoryPart";
import {RateLimiterMemory} from "rate-limiter-flexible";
import {getUserIP} from "@/project-utils/getUserIP";
import {appConstants} from "@/lib/appConstants";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {APIResponse} from "@/app/types/APIResponse";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";


// Rate limiter
const rateLimiter = new RateLimiterMemory({
    points: 3,
    duration: getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toSeconds)
})

// S3
const s3 = new S3Client({
    region: process.env.BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
})

// TODO: 19/07/25 - triggering the rate limit and invalidating the local cache will cause the ui to return an error
//                  rather than just looking into the cache we have, should fix but not a problem right now
// TODO: handle errors better here
/**
 * Obtains inventory part data from the database.
 */
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
        SELECT parts.sku, parts.name, categories.category_name, parts.quantity, parts.price_cad, parts.image_key
        FROM parts
        INNER JOIN categories ON parts.category_id = categories.id
    `;

    // Format the data for use
    const formattedData: InventoryPart[] = await Promise.all(
        data.map(async (row) => {
            let signedUrl = null;

            // Generate a signedUrl for the S3 images
            if (row.image_key) {
                const command = new GetObjectCommand({
                    Bucket: process.env.BUCKET_NAME!,
                    Key: row.image_key,
                });

                signedUrl = await getSignedUrl(
                    s3,
                    command,
                    {expiresIn: getTimeFromMinutes(appConstants.CACHE_DEBOUNCE_IN_MINUTES, conversionTypes.toMilliseconds)}
                );
            }

            return {
                sku: row.sku,
                name: row.name,
                category_name: row.category_name,
                quantity: Number(row.quantity),
                price_cad: Number(row.price_cad),
                image_key: row.image_key,
                signed_url: signedUrl,
            };
        })
    );

    return NextResponse.json(formattedData, {status: 200});
}

/**
 * Uploads the POSTed data to the database.
 *
 * @param req The client request.
 * @constructor
 */
export async function POST(req: Request) {
    const parts: InventoryPart[] = await req.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    // TODO: NOT SECURED WITH USER YET
    try {
        for (const part of parts) {
            await sql`
                UPDATE parts
                SET quantity = ${part.quantity}
                WHERE sku = ${part.sku};
            `;
        }

        return NextResponse.json<APIResponse>({success: true}, {status: 200});
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json<APIResponse>({success: true, error: error.message}, {status: 500});
        }
    }

}