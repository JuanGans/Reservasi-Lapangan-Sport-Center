import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '@/layout/DashboardLayout';
import Toast from '@/components/toast/Toast';
import { useRouter } from 'next/router';
import LandingAnimation from '@/components/animation/LandingAnimation';

interface Facility {
  id: number;
  field_name: string;
  field_desc: string;
  field_image?: string;
  price_per_session: string;
  avg_rating?: number;
  total_review?: number;
}

const PAGE_SIZE = 12;

const MemberCatalogPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const res = await fetch('/api/facilities/getAllFacilities');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setFacilities(data);
      } catch (error) {
        console.error(error);
        setToast({ message: 'Gagal memuat data', type: 'error' });
      }
    }
    fetchFacilities();
  }, []);

  const handleCardClick = (id: number) => () => {
    router.push(`/detail_catalog?id=${id}`);
  };

  const filteredFacilities = useMemo(() => {
    let filtered = [...facilities];

    if (searchTerm.trim()) {
      filtered = filtered.filter((f) =>
        f.field_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const priceA = parseFloat(a.price_per_session);
      const priceB = parseFloat(b.price_per_session);
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

    return filtered;
  }, [facilities, searchTerm, sortOrder]);

  const totalPages = Math.ceil(filteredFacilities.length / PAGE_SIZE);
  const paginatedFacilities = filteredFacilities.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <DashboardLayout title="Catalog Member">
        <h2 className="text-blue-900 font-semibold text-xl mb-6">
          Ini Catalog
        </h2>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
          <input
            type="text"
            placeholder="Cari lapangan..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-blue-800 text-blue-900 rounded px-3 py-2 w-full md:w-1/3"
          />

          <select
            className="border border-blue-800 text-blue-900 rounded px-3 py-2 w-full md:w-1/5 cursor-pointer"
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setCurrentPage(1);
            }}
          >
            <option value="asc">Harga Terendah</option>
            <option value="desc">Harga Tertinggi</option>
          </select>
        </div>

        {/* Card Grid */}
        {paginatedFacilities.length === 0 ? (
          <p className="text-center text-gray-500">
            Tidak ada lapangan ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedFacilities.map((field) => (
              <div
                key={field.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
                onClick={handleCardClick(field.id)}
              >
                <img
                  src={field.field_image || '/assets/field/fallback.jpg'}
                  alt={field.field_name}
                  className="w-full h-48 object-cover rounded mb-3"
                />
                <h3 className="text-blue-900 font-semibold text-lg mb-1">
                  {field.field_name}
                </h3>
                <p className="text-gray-600 text-sm flex-grow">
                  {field.field_desc}
                </p>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-700">
                  <span>
                    Harga: Rp.{' '}
                    {parseInt(field.price_per_session).toLocaleString('id-ID')}
                  </span>
                  <span>
                    ⭐ {field.avg_rating ? field.avg_rating.toFixed(1) : '-'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded border border-blue-800 text-blue-900 cursor-pointer ${
                  page === currentPage ? 'bg-blue-600 text-white' : ''
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900"
            >
              Next
            </button>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default MemberCatalogPage;
