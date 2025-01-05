import VendorSignUpForm from "@/components/auth/signup-vendor-form";

const Page = () => {
    return (
        <div className="bg-gray-50">
            <div className="min-h-screen flex flex-col items-center justify-center py-5 px-4">
                <div className="max-w-md w-full">
                    <VendorSignUpForm />
                </div>
            </div>
        </div>
    );
};

export default Page;
