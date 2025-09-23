import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex sticky top-0 z-50 px-4 md:px-0 h-20 flex items-center">
            <div className="md:max-w-md w-full md:mx-auto rounded-full border border-slate-200 flex items-center px-4 py-3 h-fit bg-white/90 backdrop-blur-md shadow-sm">
            <Link href="/" className="flex items-center w-fit">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-8 select-none" />
            <h1 className="font-extrabold text-xl ml-2 header-logo text-black">DoJang</h1>
            </Link>
            </div>
        </div>
    )
}