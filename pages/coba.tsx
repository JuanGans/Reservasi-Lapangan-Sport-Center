// pages/cobacoba.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ConfirmationPopup from '../components/ConfirmationPopup';

const CobaPage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleConfirm = () => {
    // Handle confirmation logic here
    console.log('Confirmed!');
    setIsPopupOpen(false);
  };

  return (
    <div>
      <Header />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Konten utama halaman cobacoba */}
          <h1>Selamat datang di halaman Coba Coba</h1>
          <button onClick={() => setIsPopupOpen(true)}>Open Popup</button>

          <ConfirmationPopup 
            isOpen={isPopupOpen}
            title="Konfirmasi"
            message="Apakah Anda yakin ingin melanjutkan?"
            onConfirm={handleConfirm}
            onCancel={() => setIsPopupOpen(false)}
            confirmText="Ya, Lanjutkan"
            cancelText="Kembali"
          />
        </div>
      </div>
    </div>
  );
};

export default CobaPage;
