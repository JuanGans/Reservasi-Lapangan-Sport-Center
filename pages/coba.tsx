// pages/cobacoba.tsx
import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ConfirmationPopup from '../components/ConfirmationPopup';
import ReservationDetailPopup from '@/components/ReservationDetailPopup';

const CobaPage: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailPopupOpen, setIsDetailPopupOpen] = useState(false);

  const sampleReservation = {
    invoiceNumber: '-',
    venueName: 'Metro Atom Futsal Badminton',
    venueAddress: 'Pd Pasar Jaya Pasar Baru Metro Atom Plaza Lt. 8 (Gedung Parkir) Jakarta Pusat, Kota Jakarta Pusat, Daerah Khusus Ibukota Jakarta',
    facilityType: 'Lapangan Futsal',
    bookingDate: 'Sabtu, 17 Mei 2025',
    bookingTime: '13:00 - 14:00',
    rentalFee: 'Rp160.000',
    convenienceFee: 'Rp0',
    transactionFee: 'Rp3.400',
    totalAmount: 'Rp163.400',
    paymentMethod: 'QRIS',
    paymentStatus: 'pending',
    timeRemaining: '00:29:40',
    qrCodeUrl: '/qr-code-example.png', // Replace with actual QR code
  };

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
          <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Reservations</h1>
      
      {/* Example card that opens the detail popup */}
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-semibold">{sampleReservation.venueName}</h2>
            <p className="text-sm text-gray-600">{sampleReservation.bookingDate}</p>
          </div>
          <button 
            onClick={() => setIsDetailPopupOpen(true)}
            className="px-4 py-2 bg-red-700 text-white rounded-lg"
          >
            View Details
          </button>
        </div>
      </div>
      
      {/* Reservation Detail Popup */}
      <ReservationDetailPopup 
        isOpen={isDetailPopupOpen}
        onClose={() => setIsDetailPopupOpen(false)}
        reservation={sampleReservation}
      />
    </div>
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
