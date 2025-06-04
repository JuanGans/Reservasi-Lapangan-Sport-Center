import Link from "next/link";
import React from "react";
import { Instagram, Github } from "lucide-react";
import LandingAnimation from "@/components/animation/LandingAnimation";

const Footer: React.FC = () => {
  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/catalog", label: "Katalog" },
    // { href: "/articles", label: "Artikel & Informasi" },
    { href: "/about", label: "Tentang Kami" },
    // { href: "/contact", label: "Kontak" },
  ];

  const relatedLinks = [
    { href: "https://www.polinema.ac.id", label: "Polinema" },
    { href: "https://jti.polinema.ac.id", label: "Jurusan Teknologi Informasi" },
  ];

  const socialLinks = [
    {
      icon: <Instagram size={18} />,
      href: "#",
      label: "Instagram",
    },
    {
      icon: <Github size={18} />,
      href: "https://github.com/JuanGans/Reservasi-Lapangan-Sport-Center",
      label: "GitHub",
    },
    {
      icon: <i className="fas fa-link text-sm" />,
      href: "#",
      label: "API",
    },
  ];

  return (
    <footer className="bg-blue-900 text-white text-sm px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <LandingAnimation delay={0}>
          <div>
            <h4 className="text-lg font-semibold mb-3">JTI Sport Center</h4>
            <p className="mb-1">Jl. Soekarno Hatta No.9, Malang</p>
            <p className="mb-1">Telepon: (0341) 404424</p>
            <p className="mb-1">
              Email:{" "}
              <a href="mailto:jti@polinema.ac.id" className="underline hover:text-blue-200">
                jti@polinema.ac.id
              </a>
            </p>
          </div>
        </LandingAnimation>

        <LandingAnimation delay={0.1}>
          <div>
            <h4 className="text-lg font-semibold mb-3">Navigasi</h4>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </LandingAnimation>

        <LandingAnimation delay={0.2}>
          <div>
            <h4 className="text-lg font-semibold mb-3">Tautan Terkait</h4>
            <ul className="space-y-2">
              {relatedLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </LandingAnimation>

        <LandingAnimation delay={0.3}>
          <div>
            <h4 className="text-lg font-semibold mb-3">Media Sosial</h4>
            <ul className="space-y-3">
              {socialLinks.map(({ icon, href, label }) => (
                <li key={label} className="flex justify-center md:justify-start items-center gap-2">
                  {icon}
                  <a href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </LandingAnimation>
      </div>

      <LandingAnimation>
        <div className="text-center mt-10 border-t border-blue-800 pt-6 text-xs">&copy; {new Date().getFullYear()} Politeknik Negeri Malang - JTI Sport Center. Semua hak dilindungi.</div>
      </LandingAnimation>
    </footer>
  );
};

export default Footer;
