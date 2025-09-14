import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex bg-white sticky top-0 py-6 z-50">
        <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-8 select-none" />
            <h1 className="font-extrabold text-2xl ml-2">DoJang</h1>
            </Link>
        </div>
    )
}