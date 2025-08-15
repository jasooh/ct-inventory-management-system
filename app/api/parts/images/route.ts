// This endpoint generates a signed URL for the client to upload their image to S3.
// Endpoint: /api/parts/images

// Rate limiter
import {RateLimiterMemory} from "rate-limiter-flexible";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getUserIP} from "@/project-utils/getUserIP";
import {NextResponse} from "next/server";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
import {stackServerApp} from "@/stack";
import {appConstants} from "@/lib/appConstants";
import {APIResponse} from "@/app/types/APIResponse";

const rateLimiter = new RateLimiterMemory({
    points: appConstants.IMAGE_ADD_LIMIT as number | undefined,
    duration: getTimeFromMinutes(
        appConstants.IMAGE_ADD_DEBOUNCE_IN_MINUTES,
        conversionTypes.toSeconds
    )
})

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
// S3
const s3 = new S3Client({
    region: process.env.BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
})

/**
 * Uploads a new image to S3.
 *
 * @param req The request.
 */
export async function POST(req: Request) {
    const auth = await requireAuthOr401();
    if (auth instanceof NextResponse) return auth;

    let key = auth.id as string | undefined;
    if (!key) {
        const ip = await getUserIP();
        key = `ip:${ip}`;
    }

    try {
        await rateLimiter.consume(key, 1);
    } catch (e: any) {
        const ms = typeof e?.msBeforeNext === "number" ? e.msBeforeNext : 10_000;
        return NextResponse.json(
            { message: "Too many requests." },
            { status: 429, headers: { "Retry-After": Math.ceil(ms / 1000).toString() } }
        );
    }

    const image_key: string = await req.text()
    let uploadUrl: string
    try {
        const cmd = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: image_key,
            ContentType: "image/png"
        })
        uploadUrl = await getSignedUrl(s3, cmd, {
            expiresIn: getTimeFromMinutes(
                appConstants.IMAGE_ADD_DEBOUNCE_IN_MINUTES,
                conversionTypes.toSeconds
            )
        });
    } catch (err) {
        console.error("Failed to generate signed URL:", err)
        return NextResponse.json(
            { message: "Failed to generate signed URL", error: (err as Error).message },
            { status: 500 }
        )
    }

    let downloadUrl: string;
    try {
        const getCmd = new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: image_key,
        });
        downloadUrl = await getSignedUrl(s3, getCmd, { expiresIn: 3600 });
    } catch (err) {
        console.error("GET presign failed:", err);
        return NextResponse.json(
            {message: "Failed to generate download URL", error: (err as Error).message},
            {status: 500}
        );
    }

    return NextResponse.json({ uploadUrl, downloadUrl }, { status: 200 })
}