import React, { useEffect, useState, useMemo } from "react";
import StepIndicator from "@/components/booking/steps/StepIndicator";
import StepDetailBooking from "@/components/booking/steps/StepDetailBooking";
import StepMetodePembayaran from "@/components/booking/steps/StepMetodePembayaran";
import StepPembayaran from "@/components/booking/steps/StepPembayaran";
import StepSelesai from "@/components/booking/steps/StepSelesai";
import ConfirmModal from "@/components/booking/steps/ConfirmModal";
import PaymentModal from "@/components/booking/steps/PaymentModal";
import { useUser } from "@/context/userContext";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import { AnimatePresence, motion } from "framer-motion";
import { Booking } from "@/types/booking";
import { useRouter } from "next/router";

interface PaymentMethod {
  name: string;
  icon: string;
}

const steps = ["Detail Booking", "Metode Pembayaran", "Pembayaran", "Selesai"];
const stepPaths = ["detail", "method", "payment", "success"];
const stepSlugMap: Record<string, number> = {
  detail: 0,
  method: 1,
  payment: 2,
  success: 3,
};

const BookingSteps = () => {
  const { user } = useUser();
  const router = useRouter();
  const stepParam = router.query.step as string[] | undefined;
  const stepSlug = stepParam?.[0] ?? "";
  const currentStep = stepSlugMap[stepSlug] ?? 0;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60);
  const [timerActive, setTimerActive] = useState(false);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  // useEffect(() => {
  //   if (!stepSlug) {
  //     router.replace("/member/booking/detail");
  //   }
  // }, [stepSlug, router]);

  const goToStep = (step: number) => {
    const path = `/member/booking/${stepPaths[step]}`;
    router.push(path);
  };

  // Dummy data sementara
  const [bookingData, setBookingData] = useState<Booking>({
    id: 10,
    booking_date: "2025-07-10",
    booking_status: "pending",
    total_price: 300000,
    created_at: new Date().toISOString(),
    expired_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    facility: {
      id: 1,
      field_name: "Lapangan Futsal A",
      field_image: "futsal_1.jpg",
    },
    sessions: [
      { id: 1, session_label: "07:00 - 08:00", start_time: "07:00", end_time: "08:00" },
      { id: 2, session_label: "08:00 - 09:00", start_time: "08:00", end_time: "09:00" },
    ],
  });

  // Countdown logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timerActive && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setTimerActive(false);
      alert("Waktu pembayaran habis, silakan ulangi proses booking.");
      goToStep(0);
      setSelectedMethod(null);
      setCountdown(15 * 60);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timerActive, countdown]);

  const handleNext = () => {
    if (currentStep === 1 && !selectedMethod) {
      setToast({ message: "Silakan pilih metode pembayaran", type: "info" });
      return;
    }

    if (currentStep === 1) {
      setShowConfirmModal(true);
    } else {
      goToStep(currentStep + 1);
    }
  };

  const handleConfirmPaymentMethod = () => {
    setShowConfirmModal(false);
    goToStep(2);
    setTimerActive(true);
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handleSubmitPayment = (file: File | null) => {
    setShowPaymentModal(false);
    setToast({ message: "Bukti pembayaran terkirim, menunggu konfirmasi admin.", type: "success" });
    goToStep(3);
    setTimerActive(false);
  };

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <StepDetailBooking user={user} booking={bookingData} />;
      case 1:
        return <StepMetodePembayaran selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />;
      case 2:
        return <StepPembayaran selectedMethod={selectedMethod} countdown={countdown} booking={bookingData} showToast={showToast} />;
      case 3:
        return <StepSelesai />;
      default:
        return null;
    }
  }, [currentStep, user, bookingData, selectedMethod, countdown]);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Booking">
        <div className="max-w-3xl mx-auto p-4 mt-6 relative">
          <StepIndicator steps={steps} currentStep={currentStep} />
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              layout
              className="min-h-[400px] sm:min-h-[500px] transition-all overflow-hidden"
            >
              {stepContent}
            </motion.div>
          </AnimatePresence>

          <div className={`flex justify-center mt-8`}>
            {currentStep > 0 && currentStep < 2 && (
              <button onClick={() => goToStep(currentStep - 1)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-300 bg-gray-500 transition duration-300 cursor-pointer mr-3">
                &lt;&lt; Kembali
              </button>
            )}

            {currentStep < 2 && (
              <button onClick={handleNext} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer">
                &gt;&gt; {currentStep === 2 ? "Selesai" : "Lanjutkan"}
              </button>
            )}

            {currentStep === 2 && (
              <button onClick={handleOpenPaymentModal} className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer transition duration-300">
                Upload Bukti
              </button>
            )}
          </div>

          <AnimatePresence>{showConfirmModal && <ConfirmModal selectedMethod={selectedMethod} onCancel={() => setShowConfirmModal(false)} onConfirm={handleConfirmPaymentMethod} />}</AnimatePresence>

          <AnimatePresence>{showPaymentModal && <PaymentModal onClose={() => setShowPaymentModal(false)} onSubmit={handleSubmitPayment} />}</AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
};

export default BookingSteps;
