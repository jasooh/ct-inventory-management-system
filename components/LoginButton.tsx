// LoginButton.tsx
// This component renders the admin login button.

'use client';

import {Button} from "@/components/ui/button";
import {UserCircleIcon} from "@heroicons/react/16/solid";
import {useRouter} from "next/navigation";
import {UserButton, useUser} from "@stackframe/stack";

export default function LoginButton() {
    const router = useRouter();
    const user = useUser();

    /**
     * Handles redirecting the user to the Stack auth login page
     */
    function handleLoginRedirect() {
        router.push("/handler/sign-in");
    }

    return user ? (
        <UserButton/>
    ) : (
        <Button className="w-full" onClick={handleLoginRedirect}>
            <UserCircleIcon className="size-4"/>
            Admin Log-in
        </Button>
    )
}