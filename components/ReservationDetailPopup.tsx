import React, { useState, useEffect } from 'react';

interface ReservationData {
  invoiceNumber?: string;
  venueName: string;
  venueAddress: string;
  facilityType: string;
  bookingDate: string;
  bookingTime: string;
  rentalFee: string;
  additionalFees?: {
    name: string;
    amount: string;
  }[];
  convenienceFee: string;
  transactionFee: string;
  totalAmount: string;
  paymentMethod: string;
  paymentStatus: string;
  timeRemaining?: string;
  qrCodeUrl?: string;
}

interface ReservationDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationData;
}

const ReservationDetailPopup: React.FC<ReservationDetailPopupProps> = ({
  isOpen,
  onClose,
  reservation
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);
  
  if (!isOpen && !isAnimating) return null;

  const renderPaymentStatus = () => {
    if (reservation.paymentStatus === 'pending') {
      return (
        <div className="p-4 mb-4 bg-white rounded-lg shadow">
          <div className="flex items-start mb-2">
            <div className="flex-shrink-0 mr-3">
              <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Menunggu Pembayaran</h3>
              <p className="text-gray-600">Selesaikan pembayaran dalam</p>
              <p className="text-red-500 text-2xl font-bold">{reservation.timeRemaining}</p>
            </div>
          </div>
          
          <div className="flex items-center mb-4 mt-6">
            <img src="/qris-logo.png" alt="QRIS" className="h-8 mr-3" />
            <span className="font-medium text-lg">QRIS</span>
          </div>
          
          {reservation.qrCodeUrl && (
            <div className="flex flex-col items-center my-4">
              <img src={reservation.qrCodeUrl} alt="QR Code" className="w-48 h-48" />
              <button className="text-red-600 font-medium mt-2">Unduh QR Code</button>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay - semi-transparent to see content behind */}
      <div 
        className={`absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 ${
    isOpen ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Popup with slide-down animation */}
      <div 
        className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10 transition-transform transition-opacity duration-300 ease-out transform ${
  isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-32 opacity-0'
}
        } max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Detail Order • Booking Venue</h2>
        </div>
        
        <div className="p-2">
          {/* Payment Status Section */}
          {renderPaymentStatus()}
          
          {/* Payment Details Section */}
          <div className="p-4 mb-4 bg-white rounded-lg shadow">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <h3 className="font-semibold text-lg">Rincian Pembayaran</h3>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 mb-2">Biaya Sewa</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                <p className="text-gray-800">{reservation.facilityType} {reservation.rentalFee}</p>
              </div>
              
              {reservation.additionalFees && reservation.additionalFees.length > 0 && (
                <div className="mt-4">
                  <p className="text-gray-600 mb-2">Biaya Produk Tambahan</p>
                  {reservation.additionalFees.map((fee, index) => (
                    <div key={index} className="flex items-center mb-1">
                      <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                      <p className="text-gray-800">{fee.name} {fee.amount}</p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 pb-2 border-b border-gray-200">
                <p className="text-gray-800">Total Biaya Sewa & Jasa {reservation.rentalFee}</p>
              </div>
              
              <div className="mt-2 flex justify-between">
                <p className="text-gray-800">Convenience Fee</p>
                <p className="text-gray-800">{reservation.convenienceFee}</p>
              </div>
              
              <div className="flex justify-between mt-2 pb-4 border-b border-gray-200">
                <p className="text-gray-800">Biaya Transaksi</p>
                <p className="text-gray-800">{reservation.transactionFee}</p>
              </div>
              
              <div className="flex justify-between mt-4 font-bold">
                <p>Total Bayar</p>
                <p>{reservation.totalAmount}</p>
              </div>
            </div>
          </div>
          
          {/* Booking Details Section */}
          <div className="p-4 mb-4 bg-white rounded-lg shadow">
            <div className="flex items-center mb-3">
              <div className="w-3 h-3 bg-red-600 rounded-full mr-2"></div>
              <h3 className="font-semibold text-lg">Detail Booking</h3>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">No. Invoice:</p>
                <p className="text-gray-800">{reservation.invoiceNumber || '-'}</p>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-4">{reservation.venueName}</h4>
              <div className="flex items-start mt-1">
                <p className="text-gray-600 pr-2">{reservation.venueAddress}</p>
                <button className="text-red-600 font-medium flex-shrink-0">Map</button>
              </div>
              
              <h4 className="font-medium text-gray-800 mt-4">{reservation.facilityType}</h4>
              <div className="flex items-center mt-1 border-l-4 border-gray-300 pl-2">
                <p className="text-gray-600">{reservation.bookingDate} • {reservation.bookingTime}</p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="p-4 space-y-2">
            <button className="w-full py-3 px-4 bg-red-700 text-white rounded-lg font-medium">
              Cek Status Pembayaran
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium">
              Batalkan Transaksi
            </button>
            <button className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium">
              Bantuan
            </button>
          </div>
          
          <div className="p-4 text-center text-gray-500 text-sm">
            Waktu Operasional Customer Service: Senin-Jum'at pukul 09:00-21:00 WIB
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailPopup;