import React, { useState, useEffect } from "react";
import StepIndicator from "@/components/booking/steps/StepIndicator";
import StepDataDiri from "@/components/booking/steps/StepDataDiri";
import StepMetodePembayaran from "@/components/booking/steps/StepMetodePembayaran";
import StepPembayaran from "@/components/booking/steps/StepPembayaran";
import StepSelesai from "@/components/booking/steps/StepSelesai";
import ConfirmModal from "@/components/booking/steps/ConfirmModal";
import PaymentModal from "@/components/booking/steps/PaymentModal";
import { User } from "@/types/user";
import DashboardLayout from "@/layout/DashboardLayout";

// import { paymentMethods } from "@/utils/paymentMethod";

interface PaymentMethod {
  name: string;
  icon: string;
  color: string;
}

const steps = ["Data Diri", "Metode Pembayaran", "Pembayaran", "Selesai"];

const BookingSteps = ({ user }: { user: User | null }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 menit countdown
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
      alert("Waktu pembayaran habis, silakan ulangi proses booking.");
      // Reset atau kembali ke awal
      setCurrentStep(0);
      setSelectedMethod(null);
      setCountdown(15 * 60);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, countdown]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedMethod) {
      alert("Silakan pilih metode pembayaran dulu.");
      return;
    }
    if (currentStep === 1) {
      setShowConfirmModal(true);
    } else {
      setCurrentStep((s) => s + 1);
      if (currentStep === 2) setTimerActive(false); // stop timer setelah selesai
    }
  };

  const handleConfirmPaymentMethod = () => {
    setShowConfirmModal(false);
    setCurrentStep(2);
    setTimerActive(true);
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (file: File | null) => {
    setShowPaymentModal(false);
    alert("Bukti pembayaran terkirim, menunggu konfirmasi admin.");
    setCurrentStep(3);
    setTimerActive(false);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <StepDataDiri user={user} />;
      case 1:
        return <StepMetodePembayaran selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />;
      case 2:
        return <StepPembayaran selectedMethod={selectedMethod} countdown={countdown} />;
      case 3:
        return <StepSelesai />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Booking">
      <div className="max-w-3xl mx-auto p-4">
        <StepIndicator steps={steps} currentStep={currentStep} />

        <div className="min-h-[350px]">{renderStepContent()}</div>

        <div className="flex justify-between mt-8">
          {currentStep > 0 && currentStep < 3 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 2} // disable kembali saat step pembayaran (sesuai request)
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
            >
              Kembali
            </button>
          )}

          {currentStep < 3 && (
            <button onClick={handleNext} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed">
              {currentStep === 2 ? "Selesai" : "Lanjutkan"}
            </button>
          )}

          {currentStep === 2 && (
            <button onClick={handleOpenPaymentModal} className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700">
              Upload Bukti
            </button>
          )}
        </div>

        {showConfirmModal && <ConfirmModal selectedMethod={selectedMethod} onCancel={() => setShowConfirmModal(false)} onConfirm={handleConfirmPaymentMethod} />}

        {showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onSubmit={handleSubmitPayment} />}
      </div>
    </DashboardLayout>
  );
};

export default BookingSteps;
