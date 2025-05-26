import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_EXPANDED_WIDTH = 256; // 16rem
const SIDEBAR_COLLAPSED_WIDTH = 80; // 5rem

const Sidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileView(isMobile);

      if (!isMobile) {
        const saved = localStorage.getItem("sidebarCollapsed");
        setIsCollapsed(saved === "true");
        setIsMobileSidebarOpen(false);
        enableBodyScroll();
      } else {
        // Mobile view: enable scroll if sidebar closed
        if (!isMobileSidebarOpen) enableBodyScroll();
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState !== null) setIsCollapsed(savedState === "true");
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        const formattedRole = data.role ? data.role.charAt(0).toUpperCase() + data.role.slice(1).toLowerCase() : "";
        setRole(formattedRole);
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setRole("");
      }
    }
    fetchUserRole();
  }, []);

  // Lock/Unlock body scroll on mobile drawer open/close
  useEffect(() => {
    if (isMobileSidebarOpen) {
      disableBodyScroll();
    } else {
      enableBodyScroll();
    }
  }, [isMobileSidebarOpen]);

  const disableBodyScroll = () => {
    document.body.style.overflow = "hidden";
  };
  const enableBodyScroll = () => {
    document.body.style.overflow = "";
  };

  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", String(newState));
  };

  const navItem = (href: string, iconClass: string, label: string, active: boolean = false) => (
    <Link href={href} key={label}>
      <motion.div whileHover={{ scale: 1.05 }} className={`flex items-center space-x-2 ${active ? "bg-[#0c3a66] text-white" : "hover:text-[#0c3a66]"} rounded-md transition-colors duration-200 px-4 py-2 cursor-pointer select-none`}>
        <i className={`${iconClass} text-sm`}></i>
        <motion.span
          initial={false}
          animate={{
            opacity: !isMobileView && isCollapsed ? 0 : 1,
            width: !isMobileView && isCollapsed ? 0 : "auto",
            marginLeft: !isMobileView && isCollapsed ? 0 : "0.5rem",
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap"
        >
          {label}
        </motion.span>
      </motion.div>
    </Link>
  );

  const SidebarContent = () => (
    <>
      {!isMobileView && (
        <button onClick={handleToggleCollapse} className="mb-4 pr-3 self-end text-gray-600 hover:text-gray-900 cursor-pointer hidden lg:block" aria-label="Toggle Sidebar">
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      )}

      <div className="flex items-center space-x-3 mb-6 px-2 overflow-hidden">
        <img alt="Polinema" className="w-8 h-8 flex-shrink-0" src="/assets/logo/jsc.png" />

        {!isCollapsed && (
          <div className="origin-left">
            <p className="text-xs font-bold text-gray-900 leading-none mb-1 whitespace-nowrap">
              JTI Sport Center
              <span className="text-xs text-green-600 font-bold ml-2">{role}</span>
            </p>
            <p className="text-[9px] font-normal text-gray-600 leading-none whitespace-nowrap">Politeknik Negeri Malang</p>
          </div>
        )}
      </div>

      <nav className="flex flex-col space-y-4 text-gray-700 text-sm font-semibold">
        {navItem(`/${role.toLowerCase()}`, "fas fa-th-large", "Dashboard", true)}
        {navItem(`/${role.toLowerCase()}/catalog`, "fas fa-shopping-cart", "Katalog")}
        {navItem(`/${role.toLowerCase()}/booking`, "fas fa-calendar-check", "Booking")}
        {role == "Admin" && (
          <>
            {navItem(`/${role.toLowerCase()}/users`, "fas fa-users", "Pengguna")}
            {navItem(`/${role.toLowerCase()}/transaction`, "fas fa-file-alt", "Transaksi")}
          </>
        )}
      </nav>
    </>
  );

  if (!hasLoaded) return null;

  return (
    <>
      {/* Mobile hamburger */}
      <button onClick={() => setIsMobileSidebarOpen(true)} className="lg:hidden fixed top-8 left-4 z-[100] bg-white p-2 rounded shadow cursor-pointer" aria-label="Open Sidebar">
        <Menu size={24} />
      </button>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
        className="hidden lg:flex fixed top-0 left-0 h-screen bg-white border-r border-gray-200 flex-col px-4 py-6 overflow-hidden z-[40]"
        style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div className="fixed inset-0 bg-black/70 z-[90]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileSidebarOpen(false)} aria-hidden="true" />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 flex flex-col px-4 py-6 z-[100] overflow-y-auto"
            >
              <button onClick={() => setIsMobileSidebarOpen(false)} className="mb-4 self-end text-gray-600 hover:text-gray-900 cursor-pointer text-xl" aria-label="Close Sidebar">
                ✕
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Content wrapper yang geser sesuai sidebar */}
      <main
        style={{
          marginLeft: isMobileView ? 0 : isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH,
          transition: "margin-left 0.3s ease",
          minHeight: "100vh",
        }}
        className="bg-gray-50 flex-1 p-6"
      >
        {children}
      </main>
    </>
  );
};

export default Sidebar;
