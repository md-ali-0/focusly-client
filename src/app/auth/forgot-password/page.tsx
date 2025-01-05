import ForgotPasswordForm from "@/components/auth/forgot-password-form";

const ForgotPassword = () => {
    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-5 px-4">
                <div className="max-w-md w-full">
                    <ForgotPasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
