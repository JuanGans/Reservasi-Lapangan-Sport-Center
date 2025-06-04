// pages/catalog.tsx
import React, { useState, useEffect, useMemo } from "react";
import MainLayout from "@/layout/MainLayout";
import LandingAnimation from "@/components/animation/LandingAnimation";
import { useRouter } from "next/router";

type Facility = {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string;
  price_per_session: string; // string decimal
  avg_rating?: number;
  total_review?: number;
};

const PAGE_SIZE = 3;

export default function Catalog() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Fetch katalog data
  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchFacilities();
  }, []);

  const handleCardClick = (id: number) => () => {
    router.push(`/detail_catalog/${id}`);
  };

  // Filter + Sort + Search facilities
  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter((f) => f.field_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Sorting by price_per_session numeric ascending or descending
    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price_per_session);
      const priceB = parseFloat(b.price_per_session);
      if (sortOrder === "asc") return priceA - priceB;
      return priceB - priceA;
    });

    return filtered;
  }, [facilities, searchTerm, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredFacilities.length / PAGE_SIZE);
  const paginatedFacilities = filteredFacilities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Handle page change
  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <MainLayout title="Katalog">
      <section className="relative flex items-center justify-center bg-cover bg-center text-center px-4 min-h-[320px] md:min-h-[380px]" style={{ backgroundImage: "url('/assets/bg/futsal.jpg')" }}>
        {/* Overlay hitam lebih terang supaya tulisan jelas tapi tidak gelap banget */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Konten hero, relative supaya di atas overlay */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <LandingAnimation>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">Katalog Lapangan</h1>
          </LandingAnimation>
          <LandingAnimation delay={0.1}>
            <p className="text-white text-base md:text-lg drop-shadow-md">Lihat semua lapangan yang bisa kamu booking di JTI Sport Center.</p>
          </LandingAnimation>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-10 bg-blue-100">
        {/* Controls */}
        <LandingAnimation delay={0.2}>
          <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Cari lapangan..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on search
              }}
              className="border border-blue-800 text-blue-900 rounded px-3 py-2 w-full md:w-1/3"
            />

            {/* Sort */}

            <select
              className="border border-blue-800 text-blue-900 rounded px-3 py-2 w-full md:w-1/5 cursor-pointer"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "asc" | "desc");
                setCurrentPage(1); // reset page on sort change
              }}
            >
              <option value="asc">Harga Terendah</option>
              <option value="desc">Harga Tertinggi</option>
            </select>
          </div>
        </LandingAnimation>

        {/* Card Grid */}
        {paginatedFacilities.length === 0 ? (
          <LandingAnimation>
            <p className="text-center text-gray-500">Tidak ada lapangan ditemukan.</p>
          </LandingAnimation>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedFacilities.map((field) => (
              <LandingAnimation key={field.id} delay={field.id * 0.1}>
                <div key={field.id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer" onClick={handleCardClick(field.id)}>
                  <img src={field.field_image ? `/assets/field/${field.field_image}` : "/assets/field/fallback.jpg"} alt={field.field_name} className="w-full h-48 object-cover rounded mb-3" />
                  <h3 className="text-blue-900 font-semibold text-lg mb-1">{field.field_name}</h3>
                  <p className="text-gray-600 text-sm flex-grow">{field.field_desc}</p>
                  <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                    <span>Harga: Rp. {parseInt(field.price_per_session).toLocaleString()}</span>
                    <span>⭐ {field.avg_rating ? field.avg_rating.toFixed(1) : "-"}</span>
                  </div>
                </div>
              </LandingAnimation>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <LandingAnimation>
            <div className="flex justify-center mt-8 space-x-2">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900">
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => goToPage(page)} className={`px-3 py-1 rounded border border-blue-800 text-blue-900 cursor-pointer ${page === currentPage ? "bg-blue-600 text-white" : ""}`}>
                  {page}
                </button>
              ))}

              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900">
                Next
              </button>
            </div>
          </LandingAnimation>
        )}
      </section>
    </MainLayout>
  );
}
