import React from "react";

interface DeleteModalProps {
  openDeleteModal: () => void;
}

const DeleteAccount: React.FC<DeleteModalProps> = ({ openDeleteModal }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 sm:mb-6">Hapus Akun</h2>
      <p className="mb-4 text-gray-600 text-sm sm:text-base leading-relaxed">Peringatan bahwa jika Anda menghapus akun Anda, semua pesan dan notifikasi Anda akan terhapus dan tidak dapat diambil kembali. Ini adalah tindakan permanen.</p>
      <div className="flex justify-end">
        <button onClick={openDeleteModal} className="bg-red-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-red-600 transition duration-200">
          Hapus Akun
        </button>
      </div>
    </div>
  );
};

export default DeleteAccount;
