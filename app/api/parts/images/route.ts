// This endpoint generates a signed URL for the client to upload their image to S3.
// Endpoint: /api/parts/images

// Rate limiter
import {RateLimiterMemory} from "rate-limiter-flexible";
import {conversionTypes, getTimeFromMinutes} from "@/lib/utils";
import {appConstants} from "@/lib/appConstants";
import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getUserIP} from "@/project-utils/getUserIP";
import {NextResponse} from "next/server";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";

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

export async function POST(req: Request) {
    // Rate limit the request
    const userIP = await getUserIP();
    try {
        await rateLimiter.consume(userIP, 1);
    } catch {
        return NextResponse.json({message: "Too many requests."}, {status: 429})
    }

    const image_key: string = await req.text()
    let uploadUrl: string
    // Generated signed URL for client
    try {
        const cmd = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME!,
            Key: image_key,
            ContentType: "image/png"
        })
        uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 60 })
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