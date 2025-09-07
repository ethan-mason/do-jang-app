"use client";
import Image from "next/image";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const [items, setItems] = useState<{ id: number; title: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  // 初回ロード時にDBからデータ取得
  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("items")
        .select("id, title")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }
    };

    fetchItems();
  }, []);

  // 新しいアイテム追加
  const addItem = async () => {
    if (newItem.trim() === "") return;
    const { data, error } = await supabase
      .from("items")
      .insert([{ title: newItem.trim() }])
      .select();

    if (error) {
      console.error(error);
    } else if (data) {
      setItems([...items, data[0]]);
      setNewItem("");
      setOpen(false);
    }
  };

  // アイテム削除
  const removeItem = async (id: number) => {
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setItems(items.filter((item) => item.id !== id));
      setMenuOpenIndex(null);
    }
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
            key={item.id}
            className="px-4 py-2 bg-slate-100 rounded-lg flex items-center relative"
          >
            <p>{item.title}</p>
            <button
              onClick={() => setMenuOpenIndex(menuOpenIndex === idx ? null : idx)}
              className="ml-auto text-slate-400"
            >
              <FiMoreVertical />
            </button>

            {/* メニュー */}
            {menuOpenIndex === idx && (
              <div className="absolute top-full right-0 mt-2 w-32 overflow-hidden bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-bold"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Add new item button */}
        <button
          onClick={() => setOpen(true)}
          className="font-bold px-4 py-2 border-slate-200 hover:bg-slate-100 bg-white border rounded-full flex items-center justify-center"
        >
          <FiPlus className="mr-2 text-lg text-slate-400" /> Add a new item
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