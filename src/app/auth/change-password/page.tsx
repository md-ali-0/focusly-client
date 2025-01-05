import ChangePasswordForm from "@/components/auth/change-password-form";
import { notFound } from "next/navigation";

interface ChangePasswordPageProps {
    id: string;
    token: string;
}

const ChangePasswordPage = async ({
    searchParams,
}: {
    searchParams: ChangePasswordPageProps;
}) => {
    const {token } = searchParams;

    if (!token) {
        notFound();
    }

    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-5 px-4">
                <div className="max-w-md w-full">
                    <ChangePasswordForm token={token} />
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
