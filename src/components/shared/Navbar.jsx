"use client";

import { signout } from "@/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession } from "@/providers/session-provider";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const Navbar = () => {
    const router = useRouter();
    const { session, setIsLoading } = useSession();

    const handleLogOut = async () => {
        setIsLoading(true);
        await signout();
        toast.success("Logout successful");
        router.push("/");
    };

    return (
        <div className="container mx-auto px-4 pt-3">
            <div className="flex items-center justify-between h-16 py-3 px-6 rounded-lg bg-white border">
                <div className="flex items-center space-x-2">
                    <Image alt="Focusly" src={'/logo.png'} width={500} height={100} className="w-24"/>
                </div>

                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="relative h-10 w-10 rounded-full"
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={
                                            session?.avatar
                                                ? `${config.img_url}/${session.avatar}`
                                                : undefined
                                        }
                                        alt="Profile"
                                    />
                                    <AvatarFallback>
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                        >
                            {/* <DropdownMenuItem asChild>
                                <Link href="/dashboard/profile">Profile</Link>
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogOut}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
