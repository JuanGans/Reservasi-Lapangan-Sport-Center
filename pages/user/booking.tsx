import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import Link from "next/link";

const Booking: React.FC = () => {
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    // Fetch data from an API or local JSON file
    const fetchFields = async () => {
      const response = await fetch("/api/katalog"); // Ganti dengan endpoint API Anda
      const data = await response.json();
      setFields(data);
    };
    fetchFields();
  }, []);

  const filteredFields = fields.filter((field) => field.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const sortedFields = filteredFields.sort((a, b) => {
    if (sortOrder === "asc") return a.price - b.price;
    return b.price - a.price;
  });

  const indexOfLastField = currentPage * itemsPerPage;
  const indexOfFirstField = indexOfLastField - itemsPerPage;
  const currentFields = sortedFields.slice(indexOfFirstField, indexOfLastField);

  return (
    <>
      <div className="bg-[#f0f2f5] min-h-screen flex">
        {/* SIDEBAR */}
        <Sidebar role={"User"} />

        {/* MAIN */}
        <main className="flex-1 p-6 text-black">
          {/* HEADER */}
          <Header />

          <h1 className="text-2xl font-bold mb-4">Katalog Lapangan</h1>

          <div className="mb-4">
            <input type="text" placeholder="Cari lapangan..." className="border rounded-md p-2" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="border rounded-md p-2 ml-2" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="asc">Harga: Rendah ke Tinggi</option>
              <option value="desc">Harga: Tinggi ke Rendah</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentFields.map((field) => (
              <div key={field.id} className="border rounded-lg p-4 shadow-md">
                <h2 className="text-lg font-semibold">{field.name}</h2>
                <p className="text-gray-600">Harga: Rp {field.price}</p>
                <Link href={`/fields/${field.id}`}>
                  <div className="text-blue-500 hover:underline">Lihat Detail</div>
                </Link>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} className="bg-blue-500 text-white rounded-md px-4 py-2">
              Sebelumnya
            </button>
            <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(sortedFields.length / itemsPerPage)))} className="bg-blue-500 text-white rounded-md px-4 py-2">
              Selanjutnya
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default Booking;
