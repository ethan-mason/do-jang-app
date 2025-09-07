import Image from "next/image";
import { FiMoreVertical, FiPlus } from "react-icons/fi";

export default function Home() {
  return (
    <div className="md:max-w-md w-full mx-4 md:mx-auto my-8">
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-8" />
        <h1 className="font-extrabold text-2xl ml-2">Claro List</h1>
      </div>
      <div className="flex flex-col space-y-4 mt-6">
        <div className="px-4 py-2 bg-slate-100 rounded-lg shadow-sm flex items-center border border-slate-200">
          <p>Listening to Music</p>
          <button className="ml-auto text-slate-400"><FiMoreVertical /></button>
        </div>
        <button className="px-4 py-2 bg-slate-100 rounded-full flex items-center justify-center"><FiPlus className="mr-2 text-lg text-slate-400" />Add a new item</button>
      </div>
    </div>
  )
}