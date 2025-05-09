import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  return (
    // HEADER - Removed unwanted bg-white and adjusted padding
    <header className="w-full flex justify-end items-center space-x-6 px-6 py-3">
      <button aria-label="Search" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
        <i className="fas fa-search text-lg"></i>
      </button>
      <button aria-label="Messages" className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
        <i className="fas fa-envelope text-lg"></i>
      </button>
      
      {/* User profile dropdown - adjusted vertical alignment */}
      <div className="relative" ref={dropdownRef}>
        <button 
          className="flex items-center space-x-2 focus:outline-none" 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
        >
          <img 
            alt="User" 
            className="w-8 h-8 rounded-full object-cover" 
            src="https://storage.googleapis.com/a1aa/image/1d3d39be-fa57-4ce7-ec8a-626bb9fb83c5.jpg" 
          />
          <div className="text-right">
            <p className="text-xs font-semibold text-gray-900 leading-tight">Roy France</p>
            <p className="text-[9px] text-gray-500 leading-tight">Customer</p>
          </div>
          <svg className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
            <Link href="/profile" legacyBehavior>
              <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg className="mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                View Profile
              </a>
            </Link>
            <Link href="/edit-profile" legacyBehavior>
              <a className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg className="mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Profile
              </a>
            </Link>
            <div className="border-t border-gray-100 my-1"></div>
            <button 
              type="button"
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onMouseDown={(e) => {
                e.stopPropagation(); // prevent dropdown from closing before handler runs
                handleLogout();
              }}
            >
              <svg className="mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V8z" clipRule="evenodd" />
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;