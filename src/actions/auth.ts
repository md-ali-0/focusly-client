"use server";

import {
    resetPassword,
    sendPasswordResetEmail,
    verifyCredentials
} from "@/lib/auth";
import {
    forgotPasswordSchema,
    loginSchema,
    resetPasswordSchema
} from "@/lib/auth-validation";
import { cookies } from "next/headers";

interface SigninFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

export async function signin(data: SigninFormValues) {
    const validatedFields = loginSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = validatedFields.data;
    const result = await verifyCredentials({ email, password });

    if (!result.success) {
        return {
            success: false,
            message: result.message,
        };
    }

    return {
        success: true,
        message: result.message,
        data: result.data,
    };
}

export async function forgotPassword(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = forgotPasswordSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { email } = validatedFields.data;
    const result = await sendPasswordResetEmail(email);

    return {
        message: result.message,
    };
}

export async function resetPasswordAction(formData: FormData) {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = resetPasswordSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
        };
    }

    const { password } = validatedFields.data;
    const result = await resetPassword(password);

    return {
        message: result.message,
    };
}

export async function signout() {
    cookies().delete("session");
}
