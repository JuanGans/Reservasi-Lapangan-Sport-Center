import React from "react";

const Header: React.FC = () => {
  return (
    // HEADER
    <header className="flex justify-end items-center space-x-6 mb-6">
      <button aria-label="Search" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
        <i className="fas fa-search text-lg"></i>
      </button>
      <button aria-label="Messages" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
        <i className="fas fa-envelope text-lg"></i>
      </button>
      <div className="flex items-center space-x-2">
        <img alt="User" className="w-6 h-6 rounded-full object-cover" src="https://storage.googleapis.com/a1aa/image/1d3d39be-fa57-4ce7-ec8a-626bb9fb83c5.jpg" />
        <div className="text-right">
          <p className="text-xs font-semibold text-gray-900 leading-none mb-1">Roy France</p>
          <p className="text-[9px] text-gray-500 leading-none">Student</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
