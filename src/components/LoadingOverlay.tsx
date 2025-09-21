"use client";
import { motion } from "framer-motion";

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-white backdrop-blur-sm">
            <div className="flex space-x-4">
                {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-4 h-4 bg-blue-400 rounded-full"
                    animate={{ y: [0, -15, 0], scale: [1, 1.3, 1] }}
                    transition={{
                    repeat: Infinity,
                    duration: 0.6,
                    delay: i * 0.2,
                    ease: "easeInOut",
                    }}
                />
                ))}
            </div>
        </div>
    );
}