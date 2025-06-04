interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center mt-8 space-x-2 pb-4">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900">
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button key={page} onClick={() => onPageChange(page)} className={`px-3 py-1 rounded border border-blue-800 text-blue-900 cursor-pointer ${page === currentPage ? "bg-blue-600 text-white" : ""}`}>
          {page}
        </button>
      ))}

      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 rounded border border-blue-800 disabled:opacity-50 cursor-pointer text-blue-900">
        Next
      </button>
    </div>
  );
};

export default Pagination;
