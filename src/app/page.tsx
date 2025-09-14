"use client";
import Image from "next/image";
import { FiMoreVertical, FiPlus } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  const [items, setItems] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(true); // ← ローディング状態追加
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  // 👇 メニューを参照するための ref
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 初回ロード時にDBからデータ取得
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("id, title")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }
      setLoading(false); // ← フェッチ完了でローディング終了
    };

    fetchItems();
  }, []);

  // 👇 外側クリックでメニューを閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuOpenIndex !== null &&
        menuRefs.current[menuOpenIndex] &&
        !menuRefs.current[menuOpenIndex]?.contains(e.target as Node)
      ) {
        setMenuOpenIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpenIndex]);

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

  // 👇 ローディングアニメーションコンポーネント
  const LoadingDots = () => (
    <div className="flex justify-center items-center h-40 space-x-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-3 h-3 bg-slate-300 rounded-full"
          animate={{ y: [0, -6, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="md:max-w-md w-full px-4 md:px-0 md:mx-auto">
      {/* header */}
      <div className="flex bg-white sticky top-0 py-6 z-50">
        <Link href="/" className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} className="w-8 select-none" />
          <h1 className="font-extrabold text-2xl ml-2">DoJang</h1>
        </Link>
      </div>

      {/* items */}
      <div className="flex flex-col space-y-4">
        {loading ? (
          <LoadingDots /> // ← ローディング表示
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="px-4 py-2 bg-slate-100 rounded-lg flex items-start relative"
            >
              <p className="whitespace-pre-line break-all mr-1">{item.title}</p>
              <div
                className="relative ml-auto"
                ref={(el) => {
                  menuRefs.current[idx] = el;
                }}
              >
                <button
                  onClick={() => setMenuOpenIndex(menuOpenIndex === idx ? null : idx)}
                  className="pt-1 ml-auto text-slate-400 outline-none focus-visible:text-slate-600 duration-200"
                >
                  <FiMoreVertical />
                </button>

                {/* メニュー */}
                <div
                  className={`absolute right-0 top-full mt-1 w-36 overflow-hidden bg-white border border-slate-200 rounded-md shadow-lg z-10 transform transition duration-200 ease-out
                  ${
                    menuOpenIndex === idx
                      ? "opacity-100 scale-100 pointer-events-auto"
                      : "opacity-0 scale-95 pointer-events-none"
                  }
                  `}
                >
                  <button
                    onClick={() => removeItem(item.id)}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 duration-200 bg-white text-red-600 select-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full sticky bottom-0 bg-white py-6">
        <button
          onClick={() => setOpen(true)}
          className="w-full select-none font-bold px-4 py-2 border-slate-200 hover:bg-slate-100 bg-white border rounded-full flex items-center justify-center outline-none focus-visible:ring-2 ring-offset-2 duration-200"
        >
          <FiPlus className="mr-2 text-lg text-slate-400" />Add a new item
        </button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-3/4 md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <textarea
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item"
              rows={3}
              className="w-full border rounded-lg px-4 py-2 mb-4 border-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 ring-blue-200 duration-200"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setOpen(false)}
                className="select-none px-4 py-2 rounded-full border bg-white border-slate-200 hover:bg-slate-100 font-bold outline-none focus-visible:ring-2 ring-offset-2 duration-200"
              >
                Cancel
              </button>
              <button
                onClick={addItem}
                className="select-none px-4 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-700 font-bold outline-none focus-visible:ring-2 ring-offset-2 duration-200"
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
