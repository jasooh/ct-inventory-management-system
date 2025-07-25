// LoginButton.tsx
// This component renders the admin login button.

'use client';

import {Button} from "@/components/ui/button";
import {UserCircleIcon} from "@heroicons/react/16/solid";
import {useRouter} from "next/navigation";
import {UserButton, useUser} from "@stackframe/stack";
import CreatePartView from "@/components/CreatePartView";

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
        <div className="flex flex-row gap-4">
            <UserButton />
            <CreatePartView />
        </div>

    ) : (
        <Button className="w-full" onClick={handleLoginRedirect}>
            <UserCircleIcon className="size-4"/>
            Admin Log-in
        </Button>
    )
}