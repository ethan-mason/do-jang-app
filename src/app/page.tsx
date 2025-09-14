"use client";
import { FiMoreVertical, FiPlus, FiLoader } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import { formatDistanceToNow } from "date-fns";
import Button from "@/components/ui/Button";

export default function Home() {
  const [items, setItems] = useState<{ id: number; title: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newItem, setNewItem] = useState("");
  const [menuOpenIndex, setMenuOpenIndex] = useState<number | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("items")
        .select("id, title, created_at")
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

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

  const addItem = async () => {
    if (newItem.trim() === "") return;
    setIsAdding(true);
    const { data, error } = await supabase
      .from("items")
      .insert([{ title: newItem.trim() }])
      .select("id, title, created_at");

    if (error) {
      console.error(error);
    } else if (data) {
      setItems([...items, data[0]]);
      setNewItem("");
      setOpen(false);
    }
    setIsAdding(false);
  };

  const removeItem = async (id: number) => {
    setDeletingId(id);
    const { error } = await supabase.from("items").delete().eq("id", id);

    if (error) {
      console.error(error);
    } else {
      setItems(items.filter((item) => item.id !== id));
      setMenuOpenIndex(null);
    }
    setDeletingId(null);
  };

  const LoadingDots = () => (
    <div className="flex justify-center items-center h-64 space-x-2">
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
    <div className="md:max-w-md w-full md:mx-auto">
      <Header />

      {/* items */}
      <div className="flex flex-col space-y-4 px-4 md:px-0">
        {loading ? (
          <LoadingDots />
        ) : (
          items.map((item, idx) => (
            <div
              key={item.id}
              className="px-4 py-3 bg-slate-100 rounded-lg flex flex-col relative"
            >
              <div className="relative">
                <span className="text-xs text-slate-400 mb-1 block">
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </span>
                <p className="whitespace-pre-line break-all mr-1">{item.title}</p>

                <div
                  className="absolute top-0 right-0"
                  ref={(el) => {
                    menuRefs.current[idx] = el;
                  }}
                >
                  <button
                    onClick={() => setMenuOpenIndex(menuOpenIndex === idx ? null : idx)}
                    className="pt-1 text-slate-400 outline-none focus-visible:text-slate-600 duration-200"
                  >
                    <FiMoreVertical />
                  </button>

                  {/* メニュー内容 */}
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
                      disabled={deletingId === item.id}
                      tabIndex={menuOpenIndex === idx ? 0 : -1}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 focus-visible:bg-red-50 duration-200 bg-white text-red-600 select-none flex items-center"
                    >
                      {deletingId === item.id ? (
                        <FiLoader className="animate-spin mr-2" />
                      ) : null}
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-full sticky bottom-0 bg-white py-6 px-4 md:px-0">
        <Button variant="secondary" onClick={() => setOpen(true)} className="w-full" icon={<FiPlus className="text-slate-400" />}>
          Add a new item
        </Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-3/4 md:w-1/4">
            <h2 className="text-xl font-bold mb-4">Add New Item</h2>
            <textarea
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter new item..."
              rows={3}
              className="placeholder:text-sm w-full border rounded-lg px-4 py-2 mb-4 border-slate-200 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-2 ring-blue-200 duration-200"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="secondary" onClick={() => setOpen(false)} disabled={isAdding}>
                Cancel
              </Button>
              <Button onClick={addItem} disabled={isAdding} icon={isAdding ? <FiLoader className="animate-spin" /> : undefined}>
                Add
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}