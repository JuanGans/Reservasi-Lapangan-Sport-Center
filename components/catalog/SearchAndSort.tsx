interface SearchAndSortProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortChange: (value: "asc" | "desc") => void;
}

const SearchAndSort: React.FC<SearchAndSortProps> = ({ searchTerm, onSearchChange, sortOrder, onSortChange }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <div className="w-full md:w-1/2">
        <label className="block mb-1 text-sm font-medium text-blue-900">Cari Lapangan</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Ketik nama lapangan..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="border border-blue-800 text-blue-900 rounded-lg px-4 md:w-3/4 w-full py-2 pr-10 focus:w-full transition-all duration-300 ease-in-out"
          />
        </div>
      </div>

      <div className="w-full md:w-1/4">
        <label className="block mb-1 text-sm font-medium text-blue-900">Urutkan</label>
        <select className="border border-blue-800 text-blue-900 rounded-lg px-4 py-2 w-full cursor-pointer" value={sortOrder} onChange={(e) => onSortChange(e.target.value as "asc" | "desc")}>
          <option value="asc">Harga Terendah</option>
          <option value="desc">Harga Tertinggi</option>
        </select>
      </div>
    </div>
  );
};

export default SearchAndSort;
