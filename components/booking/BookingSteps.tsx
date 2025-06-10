import React, { useEffect, useState, useMemo } from "react";
import StepIndicator from "@/components/booking/steps/StepIndicator";
import StepDetailBooking from "@/components/booking/steps/StepDetailBooking";
import StepMetodePembayaran from "@/components/booking/steps/StepMetodePembayaran";
import StepPembayaran from "@/components/booking/steps/StepPembayaran";
import StepSelesai from "@/components/booking/steps/StepSelesai";
import ConfirmModal from "@/components/booking/steps/ConfirmModal";
import PaymentModal from "@/components/booking/steps/PaymentModal";
import { useNotificationContext } from "@/context/NotificationContext";
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
  const { refetchNotifications } = useNotificationContext();
  const router = useRouter();
  const stepParam = router.query.step as string[] | undefined;
  const stepSlug = stepParam?.[0] ?? "";
  const currentStep = stepSlugMap[stepSlug] ?? 0;

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60);
  // const [timerActive, setTimerActive] = useState(false);

  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [latestBookingId, setLatestBookingId] = useState<number | null>(null);
  const [transactionId, setTransactionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const transId = localStorage.getItem("latestTransactionId");
    if (transId) {
      const id = parseInt(transId);
      setTransactionId(id);
      fetchTransaction(id);
    }
  }, []);

  const fetchTransaction = async (id: number) => {
    try {
      const res = await fetch(`/api/transactions/getTransactionById/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error("Gagal mengambil data transaksi");

      // Simpan metode pembayaran dari transaksi
      setSelectedMethod({
        name: data.transaction.payment_method,
        icon: `${data.transaction.payment_method.toLowerCase()}.png`, // atau mapping sendiri
      });
    } catch (err) {
      console.error("Gagal fetch transaction:", err);
    }
  };

  useEffect(() => {
    const storedId = localStorage.getItem("latestBookingId");
    if (!storedId) {
      router.replace("/member?notBooking=1");
      return;
    }

    const id = parseInt(storedId);
    setLatestBookingId(id);

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/getBookingById/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error("Failed to fetch booking");
        setBookingData(data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        router.replace("/member?notBooking=1");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, []);

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({ message, type });
  };

  const goToStep = (step: number) => {
    const path = `/member/booking/${stepPaths[step]}`;
    router.push(path);
  };

  // useEffect(() => {
  //   let timer: NodeJS.Timeout | null = null;

  //   if (timerActive && countdown > 0) {
  //     timer = setInterval(() => setCountdown((c) => c - 1), 1000);
  //   } else if (countdown === 0) {
  //     setTimerActive(false);
  //     alert("Waktu pembayaran habis, silakan ulangi proses booking.");
  //     goToStep(0);
  //     setSelectedMethod(null);
  //     setCountdown(15 * 60);
  //   }

  //   return () => {
  //     if (timer) clearInterval(timer);
  //   };
  // }, [timerActive, countdown]);

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

  const handleConfirmPaymentMethod = async () => {
    try {
      if (!latestBookingId || !selectedMethod) {
        setToast({ message: "Data booking atau metode pembayaran tidak valid", type: "error" });
        return;
      }

      setShowConfirmModal(false);

      const res = await fetch("/api/transactions/addTransaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId: latestBookingId,
          amount: bookingData?.total_price,
          payment_method: selectedMethod.name, // enum sesuai backend
        }),
      });

      if (!res.ok) throw new Error("Gagal membuat transaksi");

      const data = await res.json();
      refetchNotifications();
      localStorage.setItem("latestTransactionId", data.transaction.id);
      setTransactionId(data.transaction.id);
      // console.log("Transaksi berhasil:", data);

      goToStep(2);
      // setTimerActive(true);
    } catch (err) {
      console.error("Gagal konfirmasi metode pembayaran:", err);
      setToast({ message: "Gagal memproses transaksi", type: "error" });
    }
  };

  const handleOpenPaymentModal = () => {
    setShowPaymentModal(true);
  };

  // HARUS SELESAIKAN TRANSAKSI
  useEffect(() => {
    const rawSlug = router.query.step?.[0];
    if (rawSlug !== "payment" && transactionId) {
      // showToast("Dimohon selesaikan pembayaran dengan benar!", "error");
      router.replace("/member/booking/payment");
      return;
    }
  }, [router.query.step, transactionId]);

  useEffect(() => {
    if (currentStep === 3) {
      // setTransactionId(null);
      localStorage.removeItem("latestBookingId");
      localStorage.removeItem("latestTransactionId");
    }
  }, [currentStep]);

  const stepContent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return <StepDetailBooking user={bookingData?.user} booking={bookingData!} />;
      case 1:
        return <StepMetodePembayaran selectedMethod={selectedMethod} onSelectMethod={setSelectedMethod} />;
      case 2:
        return <StepPembayaran selectedMethod={selectedMethod} countdown={countdown} booking={bookingData!} showToast={showToast} />;
      case 3:
        return <StepSelesai />;
      default:
        return null;
    }
  }, [currentStep, bookingData, selectedMethod, countdown]);

  if (loading || !bookingData) {
    return (
      <DashboardLayout title="Booking">
        <div className="text-center py-20 text-blue-900">Memuat data booking...</div>
      </DashboardLayout>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title={`Booking ${bookingData.facility?.field_name}`}>
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

          <div className="flex justify-center mt-8">
            {currentStep > 0 && currentStep < 2 && (
              <button onClick={() => goToStep(currentStep - 1)} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-300 bg-gray-500 text-white transition duration-300 cursor-pointer mr-3">
                &lt;&lt; Kembali
              </button>
            )}

            {currentStep < 2 && (
              <button onClick={handleNext} className="px-6 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition duration-300 disabled:bg-blue-300 disabled:cursor-not-allowed cursor-pointer">
                &gt;&gt; Lanjutkan
              </button>
            )}

            {currentStep === 2 && (
              <button onClick={handleOpenPaymentModal} className="px-6 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition duration-300 cursor-pointer">
                Upload Bukti
              </button>
            )}
          </div>

          <AnimatePresence>{showConfirmModal && <ConfirmModal selectedMethod={selectedMethod} onCancel={() => setShowConfirmModal(false)} onConfirm={handleConfirmPaymentMethod} />}</AnimatePresence>

          <AnimatePresence>
            {showPaymentModal && (
              <PaymentModal
                key={transactionId}
                transactionId={transactionId}
                onSuccess={() => {
                  setTransactionId(null);
                  setToast({ message: "Bukti pembayaran berhasil dikirim", type: "success" });
                  refetchNotifications();
                  goToStep(3);

                  // refetchNotifications();
                  // setToast({ message: data.message, type: "success" });
                  // goToStep(3);
                }}
                onClose={() => setShowPaymentModal(false)}
              />
            )}
          </AnimatePresence>
        </div>
      </DashboardLayout>
    </>
  );
};

export default BookingSteps;
