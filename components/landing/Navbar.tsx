import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import LandingAnimation from "@/components/animation/LandingAnimation";

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuAnimate, setMenuAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const navLinks = [
    { href: "/#home", label: "Beranda" },
    { href: "/#catalog", label: "Katalog" },
    { href: "/#review", label: "Review" },
    { href: "/#faq", label: "FAQ" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      setMenuVisible(true);
      setTimeout(() => setMenuAnimate(true), 20);
    } else {
      setMenuAnimate(false);
      setTimeout(() => setMenuVisible(false), 300);
    }
  }, [menuOpen]);

  const handleSignIn = async () => {
    setLoading(true);
    await router.push("/login");
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 flex justify-between items-center transition-all duration-300 ${scrolled ? "bg-blue-900 bg-opacity-90 shadow-md backdrop-blur-md" : "bg-transparent"}`}>
        <LandingAnimation>
          <a href="/" className="inline-block bg-white rounded-full cursor-pointer">
            <img src="/assets/logo/jsc.png" alt="JTI Sport Center Logo" className="w-10 h-10 object-contain" />
          </a>
        </LandingAnimation>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-center">
          <ul className="flex space-x-10 text-white font-medium text-lg">
            {navLinks.map((link, index) => (
              <LandingAnimation key={link.href} delay={index * 0.1}>
                <li>
                  <a href={link.href} className="hover:text-blue-300">
                    {link.label}
                  </a>
                </li>
              </LandingAnimation>
            ))}
          </ul>
        </div>

        {/* Desktop Sign In */}
        <LandingAnimation>
          <button onClick={handleSignIn} className="hidden md:inline-flex items-center bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer" disabled={loading}>
            {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />}
            {loading ? "Loading..." : "Sign In"}
          </button>
        </LandingAnimation>

        {/* Hamburger */}
        <button className="md:hidden text-white focus:outline-none text-2xl cursor-pointer transition-transform duration-300" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuVisible && (
        <div className={`md:hidden fixed top-19 left-0 right-0 z-40 bg-blue-500 text-white px-6 pt-4 pb-4 transform transition-all duration-300 ease-in-out origin-top ${menuAnimate ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}`}>
          <div className="space-y-3">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block bg-blue-600 hover:bg-blue-700 rounded px-4 py-2 text-center transition-colors">
                {link.label}
              </a>
            ))}
            <button onClick={handleSignIn} disabled={loading} className="w-full flex justify-center items-center bg-blue-700 hover:bg-blue-800 rounded px-4 py-2 text-center transition-colors disabled:opacity-60 cursor-pointer">
              {loading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block mr-2" />}
              {loading ? "Loading..." : "Sign In"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
