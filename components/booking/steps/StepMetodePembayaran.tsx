import React from "react";
import { paymentMethods } from "@/utils/paymentMethod";

interface PaymentMethod {
  name: string;
  icon: string;
  color: string;
}

interface StepMetodePembayaranProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const StepMetodePembayaran: React.FC<StepMetodePembayaranProps> = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center my-4">
        <i className="text-green-600 text-4xl mb-4 fas fa-credit-card" />
        <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">Pilih Metode Pembayaran</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            onClick={() => onSelectMethod(method)}
            className={`flex flex-col border rounded-xl p-4 flex items-center justify-center gap-2 text-sm font-medium cursor-pointer transition-all duration-200 ${
              selectedMethod?.name === method.name ? "border-blue-600 bg-blue-50" : "hover:border-blue-400"
            }`}
          >
            <img src={`/assets/payment/${method.icon}`} alt={method.name} className="w-12 mb-2" />
            <span className="text-sm font-medium text-gray-800">{method.name}</span>
          </div>
        ))}
      </div>

      {selectedMethod && <p className="mt-4 text-center text-sm text-green-600 font-medium">Metode dipilih: {selectedMethod.name}</p>}
    </div>
  );
};

export default StepMetodePembayaran;
