/* eslint-disable @typescript-eslint/no-unused-vars */
import config from "@/config";
import { cookies } from "next/headers";
import { LoginFormData } from "./auth-validation";

export async function verifyCredentials(credentials: LoginFormData) {
    try {
        const res = await fetch(`${config.host}/api/auth/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            cache: "no-store",
            body: JSON.stringify(credentials),
        });

        const result = await res.json();

        if (!result?.success) {
            return {
                success: false,
                message: result?.message || "Login failed",
            };
        }
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

        if (result?.success)
            cookies().set("session", result?.data, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
                expires: expiresAt,
            });

        return {
            success: true,
            message: "Login successful",
            data: result.data,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Something went wrong. Please try again.",
        };
    }
}

export async function sendPasswordResetEmail(
    email: string
): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return {
        success: true,
        message:
            "If an account exists for that email, we have sent a password reset link",
    };
}

export async function resetPassword(
    password: string
): Promise<{ success: boolean; message: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return { success: true, message: "Password reset successfully" };
}
