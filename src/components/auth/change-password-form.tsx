"use client";

import { Input } from "@/components/ui/input";
import config from "@/config";
import { ErrorResponse } from "@/types";
import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "sonner";
import { Button } from "../ui/button";

interface FormValues {
    newPassword: string;
}

interface ChangePasswordFormProps {
    token: string | null;
}

const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ token }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const router = useRouter();

    const { mutate, isLoading, isSuccess, isError, error } = useMutation({
        mutationFn: (data: { password: string; token: string }) => {
            return fetch(`${config.host}/api/auth/reset-password`, {
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
            toast.success("Password reset successfully.");
            router.push("/auth/signin");
        }
    }, [error, isError, isSuccess, router]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            if (!token) {
                toast.error("Invalid request. Missing id or token.");
                return;
            }
            const mutedData = {
                password: data.newPassword,
                token,
            };
            mutate(mutedData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="p-8 rounded-2xl bg-white border">
            <h2 className="text-gray-800 text-center text-2xl font-bold">
                Change Password
            </h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label className="text-gray-800 text-sm mb-2 block">
                        Password
                    </label>
                    <Input
                        {...register("newPassword", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message:
                                    "Password must be at least 6 characters",
                            },
                        })}
                        type="password"
                        placeholder="Enter your password"
                        className={errors.newPassword ? "border-red-500" : ""}
                    />
                    {errors.newPassword && (
                        <span className="text-red-500 text-sm">
                            {errors.newPassword.message}
                        </span>
                    )}
                </div>
                <div className="!mt-8">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        Change Password
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
