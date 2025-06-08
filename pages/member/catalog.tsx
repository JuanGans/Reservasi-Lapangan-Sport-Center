import React, { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { useRouter } from "next/router";
import { Facility } from "@/types/facility";
import SearchAndSort from "@/components/catalog/SearchAndSort";
import Pagination from "@/components/catalog/Pagination";
import MemberFacilityCard from "@/components/catalog/MemberFacilityCard";

const PAGE_SIZE = 6;

const MemberCatalogPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error(error);
        setToast({ message: "Gagal memuat data", type: "error" });
      }
    }
    fetchFacilities();
  }, []);

  const handleCardClick = (id: number) => {
    router.push(`/member/detail_catalog/${id}`);
  };

  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];

    if (searchTerm.trim()) {
      filtered = filtered.filter((f) => f.field_name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price_per_session);
      const priceB = parseFloat(b.price_per_session);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });

    return filtered;
  }, [facilities, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredFacilities.length / PAGE_SIZE);
  const paginatedFacilities = filteredFacilities.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: "asc" | "desc") => {
    setSortOrder(value);
    setCurrentPage(1);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Katalog Member">
        <h2 className="text-blue-900 font-semibold text-xl my-6">Katalog Lapangan</h2>

        <SearchAndSort searchTerm={searchTerm} onSearchChange={handleSearchChange} sortOrder={sortOrder} onSortChange={handleSortChange} />

        {paginatedFacilities.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-gray-500">
            <i className="fas fa-search fa-4x mb-4"></i>
            <p className="text-lg">Tidak ada lapangan ditemukan.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${totalPages > 1 ? "" : "pb-8"}`}>
            {paginatedFacilities.map((field) => (
              <MemberFacilityCard key={field.id} facility={field} onClick={handleCardClick} />
            ))}
          </div>
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </DashboardLayout>
    </>
  );
};

export default MemberCatalogPage;
