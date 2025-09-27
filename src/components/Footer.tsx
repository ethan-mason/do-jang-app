import Link from "next/link";

export default function Footer() {
    return (
        <div>
            <p className="text-center text-slate-400 text-sm mb-2">&copy; 2025 <Link href="/" className="underline focus:text-blue-500 outline-none duration-200 hover:text-blue-500">DoJang</Link>. All rights reserved.</p>
        </div>
    )
}