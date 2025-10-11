import Image from "next/image";
import Link from "next/link";

export default function Header() {
    return (
        <div className="flex sticky top-0 z-50 px-4 md:px-0 h-20 bg-white">
            <div className="md:max-w-md w-full md:mx-auto flex items-center">
                <Link href="/" className="flex items-center w-fit">
                    <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-8 select-none" />
                    <h1 className="font-bold text-2xl ml-2 header-logo text-black">DoJang</h1>
                </Link>
            </div>
        </div>
    )
}