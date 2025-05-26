// components/CustomDatePicker.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  value: string;
  onChange: (value: string) => void;
  min?: string;
};

export default function CustomDatePicker({ value, onChange, min }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full" ref={ref}>
      <button onClick={() => setOpen((prev) => !prev)} className="w-full border border-gray-300 px-4 py-2 rounded text-left focus:ring-2 focus:ring-blue-500 text-blue-900 bg-white">
        {value ? new Date(value).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "Pilih Tanggal"}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="absolute z-10 bg-white border border-gray-300 mt-2 rounded shadow p-2">
            <input
              type="date"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(false); // close after selection
              }}
              min={min}
              className="border border-gray-300 px-2 py-1 rounded w-full focus:outline-none text-blue-900"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
