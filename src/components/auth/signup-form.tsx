"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import config from "@/config";
import { ErrorResponse } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";

interface FormValues {
    name: string;
    email: string;
    password: string;
}

const SignUpForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const { mutate, isLoading, isSuccess, isError, error } = useMutation({
        mutationFn: (data: FormValues) => {
            return fetch(`${config.host}/api/auth/signup`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                cache: "no-store",
                body: JSON.stringify(data),
            });
        },
    });

    const router = useRouter();

    useEffect(() => {
        if (isError) {
            const errorResponse = error as ErrorResponse;

            const errorMessage =
                (errorResponse as ErrorResponse)?.data?.message ||
                "Something Went Wrong";

            toast.error(errorMessage);
        }
        if (isSuccess) {
            toast.success("User Created Successfully");
            router.push("/auth/signin");
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        mutate(data);
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Sign Up
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Name</label>
                    <Input
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 3,
                                message: "Name must be at least 3 characters",
                            },
                        })}
                        type="text"
                        placeholder="Enter your name"
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <span className="text-red-500 text-sm">{errors.name.message}</span>
                    )}
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Email</label>
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
                        <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                </div>

                <div>
                    <label className="text-gray-800 text-sm mb-2 block">Password</label>
                    <Input
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters",
                            },
                        })}
                        type="password"
                        placeholder="Enter your password"
                        className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && (
                        <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                </div>

                <div className="!mt-8">
                    <Button type="submit" disabled={isLoading} className="w-full">
                        Sign Up
                    </Button>
                </div>

                <p className="text-gray-800 text-sm !mt-8 text-center">
                    Already have an account?{" "}
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

export default SignUpForm;
