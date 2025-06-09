import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const StepSelesai = () => {
  return (
    <motion.div className="flex flex-col items-center justify-center text-center px-6 py-12 mt-10 sm:mt-15" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <motion.div className="text-emerald-600 text-6xl mb-6" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 300 }}>
        <i className="fas fa-check-circle" />
      </motion.div>

      <h2 className="text-2xl md:text-3xl font-bold text-emerald-700 mb-2">Transaksi Selesai!</h2>
      <p className="text-gray-600 text-sm md:text-base mb-6">Bukti pembayaran telah dikirim. Mohon tunggu konfirmasi dari admin!</p>

      <Link href="/member" passHref>
        <motion.a className="inline-block bg-emerald-600 text-white font-medium px-5 py-2.5 rounded-lg shadow hover:bg-emerald-700 transition duration-300" whileTap={{ scale: 0.95 }}>
          Kembali ke Dashboard
        </motion.a>
      </Link>
    </motion.div>
  );
};

export default StepSelesai;
