import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; role: string; user_img: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // USE EFFECT - DROPDOWN PROFILE
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

  // ✅ FETCH USER DATA FROM TOKEN (/api/auth/me)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser({
            username: data.username || "User",
            role: data.role || "Member",
            user_img: data.user_img || "member.jpg",
          });
        } else {
          console.warn("User not authenticated");
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  // HANDLE LOGOUT
  const handleLogout = async () => {
    const res = await fetch("/api/auth/logout");

    if (res.redirected) {
      // Jika server memberikan redirect 302
      window.location.href = res.url;
    } else {
      // Fallback
      window.location.href = "/?logout=1";
    }
  };

  return (
    // HEADER
    <header className="w-full flex justify-end items-center space-x-6 px-6 py-3 fixed h-20 bg-white z-[2]">
      {/* SEARCH */}
      <button aria-label="Search" className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
        <i className="fas fa-shopping-cart"></i>
      </button>

      {/* MESSAGES */}
      <button aria-label="Messages" className="text-gray-500 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
        <i className="fas fa-envelope text-lg"></i>
      </button>

      {/* DROPDOWN PROFILE AND LOGOUT */}
      <div className="relative" ref={dropdownRef}>
        <button className="flex items-center space-x-2 focus:outline-none cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)} aria-expanded={isDropdownOpen} aria-haspopup="true">
          {user?.user_img ? <img alt="User" className="w-8 h-8 rounded-full object-cover" src={`/assets/user/${user.user_img}`} /> : <div className="w-8 h-8 rounded-full bg-gray-300 animate-pulse" />}

          <div className="text-right">
            {user?.username ? <p className="text-xs font-semibold text-gray-900 leading-tight">{user.username}</p> : <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mb-1" />}
            {user?.role ? <p className="text-[9px] text-gray-500 leading-tight">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p> : <div className="h-2 w-14 bg-gray-100 rounded animate-pulse" />}
          </div>

          <svg className={`ml-1 h-4 w-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "transform rotate-180" : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* DROPDOWN MENU */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
            {/* VIEW PROFILE */}
            <Link href="/profile">
              <div className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <svg className="mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Profile
              </div>
            </Link>
            {/* LOGOUT */}
            <div className="border-t border-gray-100 my-1"></div>
            <button
              type="button"
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              onMouseDown={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
            >
              <svg className="mr-2 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 5a1 1 0 10-2 0v4.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 12.586V8z"
                  clipRule="evenodd"
                />
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
