import React from "react";
import Link from "next/link";

const StepSelesai = () => {
  return (
    <div className="text-center">
      <i className="text-emerald-600 text-4xl mb-4 fas fa-check-circle" />
      <h2 className="text-xl font-bold text-emerald-700 mb-2">Transaksi Selesai!</h2>
      <p className="text-gray-700 mb-4">Pembayaran telah dikirim. Menunggu konfirmasi admin.</p>
      <Link href="/member">
        <span className="bg-emerald-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-emerald-700">Kembali ke Dashboard</span>
      </Link>
    </div>
  );
};

export default StepSelesai;
