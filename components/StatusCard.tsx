import React from "react";

interface StatusCardProps {
  title: string;
  count: number;
  description: string;
  icon: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, description, icon }) => {
  return (
    <>
      <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style={{ minHeight: "110px" }}>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <i className={`text-gray-600 text-xs ${icon}`}></i>
        </div>
        <p className="text-4xl font-extrabold text-black leading-none">{count}</p>
        <p className="text-[10px] text-gray-600 mt-2">{description}</p>
      </div>

      {/* <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style={{ minHeight: "110px" }}>
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-900 text-sm">Menunggu</p>
            <i className="far fa-clock text-gray-600 text-xs"></i>
          </div>
          <p className="text-4xl font-extrabold text-black leading-none">0</p>
          <p className="text-[10px] text-gray-600 mt-2">Total yang belum disetujui</p>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style="min-height: 110px">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-900 text-sm">Dikonfirmasi</p>
            <i className="fas fa-check text-gray-600 text-xs"></i>
          </div>
          <p className="text-4xl font-extrabold text-black leading-none">0</p>
          <p className="text-[10px] text-gray-600 mt-2">Total barang yang siap diambil</p>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style="min-height: 110px">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-900 text-sm">Selesai</p>
            <i className="fas fa-list-ul text-gray-600 text-xs"></i>
          </div>
          <p className="text-4xl font-extrabold text-black leading-none">0</p>
          <p className="text-[10px] text-gray-600 mt-2">Peminjaman yang sudah selesai</p>
        </div>
        <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style="min-height: 110px">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-gray-900 text-sm">Belum Selesai</p>
            <i className="fas fa-lock text-gray-600 text-xs"></i>
          </div>
          <p className="text-4xl font-extrabold text-black leading-none">0</p>
          <p className="text-[10px] text-gray-600 mt-2">Peminjaman yang belum selesai</p>
        </div>
      </section> */}
    </>
  );
};

export default StatusCard;
