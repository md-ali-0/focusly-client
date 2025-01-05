"use client";

import { Input } from "@/components/ui/input";
import config from "@/config";
import { ErrorResponse } from "@/types";
import Link from "next/link";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FormValues {
    email: string;
}

const ForgotPasswordForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const { mutate, isLoading, isSuccess, isError, error } = useMutation({
        mutationFn: (data: FormValues) => {
            return fetch(`${config.host}/api/auth/forget-password`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                cache: "no-store",
                body: JSON.stringify(data),
            });
        },
    });

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something went wrong";

            toast.error(errorMessage);
        }
        if (isSuccess) {
            toast.success("Password reset email sent successfully.");
        }
    }, [error, isError, isSuccess]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const sendintToast = toast.loading("Sending Password Reset Email.");
        try {
            mutate(data)
            toast.dismiss(sendintToast);
        } catch (error) {
            console.log(error);
            toast.dismiss(sendintToast);
        }
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Forgot your password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        Email
                    </label>
                    <div>
                        <Input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Invalid email address",
                                },
                            })}
                            type="email"
                            placeholder="Enter your email"
                            className={errors.email ? "border-red-500" : ""}
                        />
                        {errors.email && (
                            <span className="text-red-500 text-sm">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                </div>

                <div className="!mt-8">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        Send Reset Link
                    </Button>
                </div>
                <p className="text-gray-800 text-sm !mt-8 text-center">
                    Remembered your password?{" "}
                    <Link
                        href="/auth/signin"
                        className="text-primary hover:underline ml-1 whitespace-nowrap font-semibold"
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;
