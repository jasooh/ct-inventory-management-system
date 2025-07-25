// NumberInput.tsx
// This component renders a number input with an OTP input style.

"use client"

import {REGEXP_ONLY_DIGITS_AND_CHARS} from "input-otp"

import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {Dispatch, SetStateAction} from "react";

export function SkuInput({value, action}: { value: string, action: Dispatch<SetStateAction<string>> }) {
    return (
        <InputOTP
            maxLength={7}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
            value={value}
            onChange={action}
        >

            <InputOTPGroup>
                <InputOTPSlot index={0}/>
                <InputOTPSlot index={1}/>
                <InputOTPSlot index={2}/>
            </InputOTPGroup>
            <InputOTPSeparator/>
            <InputOTPGroup>
                <InputOTPSlot index={3}/>
                <InputOTPSlot index={4}/>
                <InputOTPSlot index={5}/>
                <InputOTPSlot index={6}/>
            </InputOTPGroup>
        </InputOTP>
    )
}
