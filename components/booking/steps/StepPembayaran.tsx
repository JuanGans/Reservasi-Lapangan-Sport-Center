import React from "react";

interface PaymentMethod {
  name: string;
  icon: string;
  color: string;
}

interface StepPembayaranProps {
  selectedMethod: PaymentMethod | null;
  countdown: number;
}

const StepPembayaran: React.FC<StepPembayaranProps> = ({ selectedMethod, countdown }) => {
  const isBank = selectedMethod ? ["BNI", "BCA", "BRI", "Mandiri"].includes(selectedMethod.name) : false;
  const isWallet = !isBank;

  const renderCountdown = () => {
    const min = String(Math.floor(countdown / 60)).padStart(2, "0");
    const sec = String(countdown % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div className="text-center px-4">
      <i className="fas fa-receipt text-purple-600 text-4xl my-4" />
      <h2 className="text-xl font-bold mb-3 text-blue-900">Detail Pembayaran</h2>

      <div className="bg-gray-50 rounded-xl p-4 mb-4 shadow-sm text-left text-sm text-gray-700 space-y-2 max-w-md mx-auto">
        <div className="flex justify-between">
          <span className="font-medium">Metode</span>
          <div className="flex gap-2">
            <span className="text-blue-700">{selectedMethod?.name || "-"}</span>
            <img src={`/assets/payment/${selectedMethod?.icon}`} alt={selectedMethod?.name} className="w-5" />
          </div>
        </div>
        {isWallet && (
          <div className="flex justify-between">
            <span className="font-medium">No HP Tujuan</span>
            <span>08123456789 a.n John Doe</span>
          </div>
        )}
        {isBank && (
          <div className="flex justify-between">
            <span className="font-medium">No Rekening</span>
            <span>1234567890 a.n John Doe</span>
          </div>
        )}
        <div className="flex justify-between text-red-600 font-semibold">
          <span>Tenggat Waktu</span>
          <span>{renderCountdown()}</span>
        </div>
      </div>
    </div>
  );
};

export default StepPembayaran;
