import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { Facility } from "@/types/facility";

const DetailCatalogPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [facility, setFacility] = useState<Facility | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    async function fetchFacilityDetail() {
      if (!id) return;

      try {
        const res = await fetch(`/api/facilities/getFacilityById/${id}`);
        if (!res.ok) throw new Error("Gagal mengambil data lapangan");
        const data = await res.json();
        setFacility(data);
      } catch (error) {
        console.error(error);
        setToast({ message: "Gagal memuat data lapangan", type: "error" });
      }
    }

    fetchFacilityDetail();
  }, [id]);

  if (!facility) {
    return (
      <DashboardLayout title="Detail Lapangan">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Detail Lapangan">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center text-blue-900 hover:text-blue-700 mb-6">
            <i className="fas fa-arrow-left mr-2"></i>
            Kembali
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img src={facility.field_image ? `/assets/field/${facility.field_image}` : "/assets/field/fallback.jpg"} alt={facility.field_name} className="w-full h-96 object-cover" />

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-2xl font-bold text-blue-900">{facility.field_name}</h1>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">
                    <i className="fas fa-star"></i>
                  </span>
                  <span className="font-medium">{facility.avg_rating ? facility.avg_rating.toFixed(1) : "-"}</span>
                  <span className="text-gray-500">({facility.total_review || 0} ulasan)</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Deskripsi</h2>
                <p className="text-gray-700 leading-relaxed">{facility.field_desc}</p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Harga per Sesi</h3>
                    <p className="text-2xl font-bold text-blue-700">Rp {parseInt(facility.price_per_session).toLocaleString("id-ID")}</p>
                  </div>
                  <button onClick={() => router.push(`/member/booking?facility_id=${facility.id}`)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors">
                    Pesan Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default DetailCatalogPage;
