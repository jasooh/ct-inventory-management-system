// This endpoint retrieves part data based on category ID.
// Endpoint: /api/parts

import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import { InventoryPart } from '@/app/types/InventoryPart';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { getUserIP } from '@/project-utils/getUserIP';
import { appConstants } from '@/lib/appConstants';
import { conversionTypes, getTimeFromMinutes } from '@/lib/utils';
import { APIResponse } from '@/app/types/APIResponse';
import {
    GetObjectCommand,
    HeadObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { stackServerApp } from '@/stack';

// Rate limiter
const rateLimiter = new RateLimiterMemory({
    points: appConstants.CACHE_CALL_LIMIT as number | undefined,
    duration: getTimeFromMinutes(
        appConstants.CACHE_DEBOUNCE_IN_MINUTES,
        conversionTypes.toSeconds
    ),
});

// S3
const s3 = new S3Client({
    region: process.env.BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!,
    },
});

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Returns user or an immediate 401 response
 */
async function requireAuthOr401() {
    const user = await stackServerApp.getUser({ or: 'return-null' });
    if (!user) {
        return NextResponse.json<APIResponse>(
            { success: false, error: 'Unauthorized' },
            { status: 401 }
        );
    }
    return user;
}

// ─────────────────────────────────────────────────────────────────────────────
/**
 * Obtains inventory part data from the database.
 */
export async function GET(): Promise<Response> {
    // Rate limit
    const userIP = await getUserIP();
    try {
        await rateLimiter.consume(userIP, 1);
    } catch {
        return NextResponse.json({ message: 'Too many requests.' }, { status: 429 });
    }

    // Query
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`
        SELECT parts.sku, parts.name, categories.category_name, parts.quantity, parts.price_cad, parts.image_key
        FROM parts
        INNER JOIN categories ON parts.category_id = categories.id
    `;

    // format (+ signed image URL if key exists)
    const formatted: InventoryPart[] = await Promise.all(
        data.map(async (row: any) => {
            let signedUrl: string | null = null;

            if (row.image_key) {
                try {
                    // Only sign if the key exists
                    await s3.send(
                        new HeadObjectCommand({
                            Bucket: process.env.BUCKET_NAME!,
                            Key: row.image_key,
                        })
                    );

                    const command = new GetObjectCommand({
                        Bucket: process.env.BUCKET_NAME!,
                        Key: row.image_key,
                    });

                    signedUrl = await getSignedUrl(s3, command, {
                        expiresIn: getTimeFromMinutes(
                            appConstants.CACHE_DEBOUNCE_IN_MINUTES,
                            conversionTypes.toSeconds
                        ),
                    });
                } catch {
                    signedUrl = null;
                }
            }

            return {
                sku: row.sku,
                name: row.name,
                category_name: row.category_name,
                quantity: Number(row.quantity),
                price_cad: Number(row.price_cad),
                image_key: row.image_key,
                signed_url: signedUrl,
            } as InventoryPart;
        })
    );

    return NextResponse.json(formatted, { status: 200 });
}

/**
 * Uploads the updated part data to the database.
 *
 * @param req The client request.
 */
export async function PUT(req: Request) {
    // AuthN
    const auth = await requireAuthOr401();
    if (auth instanceof NextResponse) return auth;

    const parts: InventoryPart[] = await req.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        for (const part of parts) {
            await sql`
                UPDATE parts
                SET quantity = ${part.quantity}
                WHERE sku = ${part.sku};
            `;
        }

        return NextResponse.json<APIResponse>({ success: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json<APIResponse>(
                { success: false, error: error.message },
                { status: 500 }
            );
        }
    }
}

/**
 * Insert a new part (secured).
 */
export async function POST(req: Request) {
    // AuthN
    const auth = await requireAuthOr401();
    if (auth instanceof NextResponse) return auth;

    const part: InventoryPart = await req.json();
    const sql = neon(`${process.env.DATABASE_URL}`);

    try {
        await sql`
            INSERT INTO parts (sku, name, category_id, quantity, price_cad, image_key)
            VALUES (${part.sku}, ${part.name}, ${part.category_name}, ${part.quantity}, ${part.price_cad},
                    ${part.image_key})
        `;

        return NextResponse.json<APIResponse>({ success: true }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json<APIResponse>(
                { success: false, error: error.message },
                { status: 500 }
            );
        }
    }
}
