import React from "react";
import Link from "next/link";

interface roleProps {
  role: string;
}

const Sidebar: React.FC<roleProps> = ({ role }) => {
  return (
    // Sidebar
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col px-6 py-8">
      {/* JTI Sport Center */}
      <div className="flex items-center space-x-3 px-2 mb-6">
        <img
          alt="Politeknik Negeri Malang - JTI Sport Center"
          className="w-8 h-8"
          src="/polinema.png" // Use a local image path or a valid URL
        />
        <div>
          <p className="text-xs font-bold text-gray-900 leading-none mb-1">
            JTI Sport Center
            <span className="text-xs text-green-600 font-bold ml-2">{role}</span>
          </p>
          <p className="text-[9px] font-normal text-gray-600 leading-none">Politeknik Negeri Malang</p>
        </div>
      </div>

      {/* Buttons */}
      <nav className="flex flex-col space-y-4 text-gray-700 text-sm font-semibold">
        <Link href="/dashboard">
          <div className="flex items-center space-x-2 bg-[#0c3a66] text-white rounded-md px-4 py-2">
            <i className="fas fa-th-large text-base"></i>
            <span>Dashboard</span>
          </div>
        </Link>
        <Link href="/data-pemesanan">
          <div className="flex items-center space-x-2 hover:text-[#0c3a66] transition-colors duration-200 px-4 py-2">
            <i className="fas fa-shopping-cart text-base"></i>
            <span>Booking</span>
          </div>
        </Link>

        {/* TASK 2: KHUSUS ADMIN */}
        {role === "Admin" && (
          <Link href="/inventaris">
            <div className="flex items-center space-x-2 hover:text-[#0c3a66] transition-colors duration-200 px-4 py-2">
              <i className="fas fa-file-alt text-base"></i>
              <span>Facilites</span>
            </div>
          </Link>
        )}
        <Link href="/riwayat-pemesanan">
          <div className="flex items-center space-x-2 hover:text-[#0c3a66] transition-colors duration-200 px-4 py-2">
            <i className="fas fa-history text-base"></i>
            <span>History</span>
          </div>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
