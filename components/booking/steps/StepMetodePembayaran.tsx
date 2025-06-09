import React from "react";
import { motion } from "framer-motion";
import { paymentMethods } from "@/utils/paymentMethod";

interface PaymentMethod {
  name: string;
  icon: string;
}

interface StepMetodePembayaranProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

const StepMetodePembayaran: React.FC<StepMetodePembayaranProps> = ({ selectedMethod, onSelectMethod }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="px-4">
      <div className="flex flex-col items-center justify-center mb-6 mt-14 sm:mt-22">
        <motion.i className="text-green-600 text-4xl mb-4 fas fa-credit-card" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }} />
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 text-center">Pilih Metode Pembayaran</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelectMethod(method)}
            className={`flex flex-col items-center justify-center text-center border rounded-2xl p-4 cursor-pointer transition-all duration-300 shadow-sm ${
              selectedMethod?.name === method.name ? "border-blue-600 bg-blue-50" : "hover:border-blue-400"
            }`}
          >
            <img src={`/assets/payment/${method.icon}`} alt={method.name} className="w-12 h-12 mb-2 object-contain" />
            <span className="text-sm font-medium text-gray-800">{method.name}</span>
          </motion.div>
        ))}
      </div>

      {selectedMethod && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center text-sm text-green-600 font-medium">
          Metode dipilih: {selectedMethod.name}
        </motion.p>
      )}
    </motion.div>
  );
};

export default StepMetodePembayaran;
