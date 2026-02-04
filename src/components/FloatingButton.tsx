"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus } from "react-icons/fa";

export default function FloatingButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-10 right-10 flex flex-col items-end space-y-5 z-50">
      {/* Menu Buttons */}
      <AnimatePresence>
        {open && (
          <>
            {/* View CV */}
            <motion.a
              href="/Naufal-Fathi-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="bg-orange-500 text-white text-xl font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              👀 View CV
            </motion.a>

            {/* Contact */}
            <motion.a
              href="https://wa.me/6281226110988"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ duration: 0.25, delay: 0.05 }}
              className="bg-blue-500 text-white text-xl font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
            >
              💬 Contact
            </motion.a>

            {/* View CV */}
            <motion.a
              href="/Naufal-Fathi-CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.8 }}
              transition={{ duration: 0.25 }}
              className="bg-orange-500 text-white text-xl font-semibold px-10 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-orange-600 transform hover:scale-105 transition-all duration-200"
            >
              👀 View job application
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Floating Main Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaPlus size={32} />
        </motion.div>
      </motion.button>
    </div>
  );
}
