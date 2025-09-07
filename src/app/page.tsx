"use client";
import Image from "next/image";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useState } from "react";

export default function Home() {
  const [items, setItems] = useState<string[]>(["Listening to Music"]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");

  const addItem = () => {
    if (newItem.trim() === "") return;
    setItems([...items, newItem.trim()]);
    setNewItem("");
    setOpen(false);
  };

  return (
    <div className="md:max-w-md w-full px-4 md:px-0 md:mx-auto my-8">
      {/* header */}
      <div className="flex items-center">
        <Image src="/logo.png" alt="Logo" width={100} height={100} className="w-8" />
        <h1 className="font-extrabold text-2xl ml-2">Claro List</h1>
      </div>

      {/* items */}
      <div className="flex flex-col space-y-4 mt-6">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="px-4 py-2 bg-slate-100 rounded-lg shadow-sm flex items-center border border-slate-200"
          >
            <p>{item}</p>
            <button className="ml-auto text-slate-400">
              <FiMoreVertical />
            </button>
          </div>
        ))}

        {/* Add new item button */}
        <button onClick={() => setOpen(true)} className="font-bold px-4 py-2 border-slate-200 hover:bg-slate-100 bg-white border rounded-full flex items-center justify-center">
          <FiPlus className="mr-2 text-lg text-slate-400" />Add a new item
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-3/4 md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item"
              className="w-full border rounded-lg px-4 py-2 mb-4 border-slate-200 placeholder:text-slate-400 outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-full border bg-white border-slate-200 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
