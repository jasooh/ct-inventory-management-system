// project-getUserIP.ts

import {headers} from "next/headers";

/**
 * Obtains the IP address of the user.
 */
export async function getUserIP() {
    const headersList = await headers()
    const ip: string =
        headersList.get("x-forwarded-for")?.split(',')[0] ||
        headersList.get("x-real-ip") ||
        '127.0.0.1';  // local dev fallback

    return ip;
}