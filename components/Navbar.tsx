import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { auth, signOut, signIn } from '@/auth';
import { BadgePlus, LogOut } from 'lucide-react'; 
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'; 

const Navbar = async () => {
    const session = await auth();
    
    return (
    <header className="px-5 py-3 bg-navy shadow-sm text-white font-work-sans">
    <nav className="flex justify-between items-center">
        <Link href="/">
            <Image src="/logo.png" alt="logo" width={144} height={30} />
        </Link>
        
        <div className="flex items-center gap-5">
            {session && session?.user ? (
                <>
                    <Link href="/startup/create" className="flex items-center gap-2">
                        <span className="max-sm:hidden">Create</span>
                        <BadgePlus className="size-6 sm:hidden" />
                    </Link>

                    <form action={async () => {
                        "use server";
                        await signOut({ redirectTo: "/" });
                    }}>
                        <button type="submit" className="flex items-center gap-2 text-white">
                            <span className="max-sm:hidden">Logout</span>
                            <LogOut className="size-6 sm:hidden text-red-500" />
                        </button>
                    </form>

                    <Link href={`/user/${session?.id}`} className="flex items-center gap-2">
                        <Avatar className="size-10">
                            <AvatarImage 
                                src={session?.user?.image || ""} 
                                alt={session?.user?.name || ""} 
                            /> 
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <span className="max-sm:hidden">{session?.user?.name}</span>
                    </Link>
                </>
            ) : (
                <form action={async () => {
                    "use server";
                    await signIn("github");
                }}>
                    <button type="submit">
                        Login
                    </button>
                </form>
            )}  
        </div>
    </nav>
    </header>
    );
}
export default Navbar;
