import React, { useState } from "react";
import Link from "next/link";
import Head from "next/head";

export default function Booking() {
  const [selectedField, setSelectedField] = useState<any>(null);

  const fields = [
    {
      name: "Lapangan Futsal A",
      description: "Lapangan indoor berstandar nasional dengan lantai vinyl dan pencahayaan LED.",
    },
    {
      name: "Lapangan Futsal B",
      description: "Cocok untuk latihan tim, tersedia ruang ganti dan tribun penonton.",
    },
    {
      name: "Lapangan Futsal C",
      description: "Lapangan outdoor dan pencahayaan malam hari.",
    },
    {
      name: "Lapangan Futsal D",
      description: "Tersedia 3 lapangan indoor ber-AC dengan lantai kayu.",
    },
    {
      name: "Lapangan Futsal E",
      description: "Lapangan dengan permukaan sintetis dan tersedia pelatih profesional.",
    },
    {
      name: "Lapangan Futsal F",
      description: "Tersedia untuk turnamen sekolah atau komunitas dengan fasilitas lengkap.",
    },
  ];

  return (
    <div className="scroll-smooth font-[Poppins]">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header & Navbar */}
      <nav className="py-4 px-6 flex justify-between items-center bg-blue-900 text-white">
        <div>
          <img src="/polinema.png" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex flex-1 justify-center">
          <ul className="flex space-x-10 text-lg">
            <li><Link href="/" className="hover:text-blue-300">Home</Link></li>
            <li><Link href="#about" className="hover:text-blue-300">About</Link></li>
            <li><Link href="#feature" className="hover:text-blue-300">Feature</Link></li>
            <li><Link href="#team" className="hover:text-blue-300">Team</Link></li>
            <li><Link href="#contact" className="hover:text-blue-300">Contact</Link></li>
          </ul>
        </div>
        <Link href="/login" className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
          Sign In
        </Link>
      </nav>

      {/* Booking Fields */}
      <section className="bg-white text-center py-16">
        <h2 className="text-3xl font-bold text-blue-900 mb-4">Pilih Lapangan Futsal</h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">Pilih lapangan yang ingin Anda booking untuk kegiatan futsal.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-6">
          {fields.map((field, idx) => (
            <div
              key={idx}
              className="bg-white shadow-md rounded-lg p-4 hover:scale-105 transition cursor-pointer"
              onClick={() => setSelectedField(field)}
            >
              <h3 className="text-blue-900 font-bold mb-2">{field.name}</h3>
              <p className="text-gray-600 text-sm">{field.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Modal Detail */}
      {selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-6 rounded-lg max-w-md w-full text-center relative">
            <button className="absolute top-2 right-3 text-gray-600 hover:text-black text-xl" onClick={() => setSelectedField(null)}>×</button>
            <h3 className="text-blue-900 font-bold text-xl mb-2">{selectedField.name}</h3>
            <p className="text-gray-700 mb-4">{selectedField.description}</p>
            <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Pesan Sekarang</Link>
          </div>
        </div>
      )}
    </div>
  );
}
