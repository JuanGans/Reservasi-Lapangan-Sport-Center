import React, { useEffect, useState, useCallback } from "react";
import DashboardLayout from "@/layout/DashboardLayout";
import Toast from "@/components/toast/Toast";
import Image from "next/image";
import { motion } from "framer-motion";
import { User } from "@/types/user";
import { Facility } from "@/types/facility";
import { sessions } from "@/utils/session";
import BookingConfirmationModal from "@/components/booking/admin/BookingConfirmModal";

export default function BookingPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [noUserFound, setNoUserFound] = useState(false);
  const [bookedSessions, setBookedSessions] = useState<string[]>([]);
  const [invalidSessions, setInvalidSessions] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const duration = selectedSlots.length;
  const totalPrice = selectedFacility ? duration * Number(selectedFacility.price_per_session) : 0;

  const parseSessionToWIBDate = useCallback((label: string, booking_date: string): { startDate: Date; endDate: Date } => {
    const [startLabel, endLabel] = label.split(" - ");
    const [startHour, startMinute] = startLabel.split(":").map(Number);
    const [endHour, endMinute] = endLabel.split(":").map(Number);

    const baseDate = new Date(booking_date);
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const day = baseDate.getDate();

    return {
      startDate: new Date(year, month, day, startHour, startMinute),
      endDate: new Date(year, month, day, endHour, endMinute),
    };
  }, []);

  const isSessionDisabled = useCallback(
    (sessionTime: string) => {
      if (!selectedDate) return false;

      const [startTime] = sessionTime.split(" - ");
      const [startHour, startMinute] = startTime.split(":").map(Number);

      const selected = new Date(selectedDate);
      const now = new Date();

      // Check if selected date is today
      const isToday = selected.toDateString() === now.toDateString();

      // Check if session time has passed
      const hasPassed = isToday && (startHour < now.getHours() || (startHour === now.getHours() && startMinute <= now.getMinutes()));

      return hasPassed || bookedSessions.includes(sessionTime);
    },
    [selectedDate, bookedSessions]
  );

  const checkSequentialSessions = useCallback((sessions: string[]): boolean => {
    if (sessions.length < 2) {
      setInvalidSessions([]);
      return true;
    }

    const sessionTimes = sessions
      .map((label) => {
        const [start, end] = label.split(" - ");
        return {
          label,
          start: parseInt(start.replace(":", ""), 10),
          end: parseInt(end.replace(":", ""), 10),
        };
      })
      .sort((a, b) => a.start - b.start);

    const invalid = sessionTimes.reduce((acc: string[], curr, i) => {
      if (i < sessionTimes.length - 1 && curr.end !== sessionTimes[i + 1].start) {
        acc.push(curr.label, sessionTimes[i + 1].label);
      }
      return acc;
    }, []);

    setInvalidSessions([...new Set(invalid)]);
    return invalid.length === 0;
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedFacility?.id) return;

    const fetchBookedSessions = async () => {
      try {
        const res = await fetch("/api/bookings/getAllBookings");
        const data = await res.json();

        const booked = data.filter((b: any) => b.facilityId === selectedFacility.id && new Date(b.booking_date).toISOString().split("T")[0] === selectedDate).flatMap((b: any) => b.sessions.map((s: any) => s.session_label));

        setBookedSessions(booked);
      } catch (err) {
        console.error("Gagal mengambil data booking:", err);
        setToast({ message: "Gagal mengambil data booking", type: "error" });
      }
    };

    fetchBookedSessions();
  }, [selectedDate, selectedFacility]);

  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlots((prev) => prev.filter((session) => !isSessionDisabled(session)));
  }, [selectedDate, isSessionDisabled]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/getAllUsers");
        const data = await res.json();
        setAllUsers(data);
      } catch (err) {
        console.error("Gagal mengambil data users:", err);
        setToast({ message: "Gagal mengambil data users", type: "error" });
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchInput.trim() === "") {
      setFilteredUsers([]);
      setNoUserFound(false);
      return;
    }

    const results = allUsers.filter((user) => user.fullname.toLowerCase().includes(searchInput.toLowerCase()));

    setFilteredUsers(results);
    setNoUserFound(results.length === 0);
  }, [searchInput, allUsers]);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await fetch("/api/facilities/getAllFacilities");
        const data = await res.json();
        setFacilities(data);
      } catch (err) {
        console.error("Gagal mengambil data facilities:", err);
        setToast({ message: "Gagal mengambil data facilities", type: "error" });
      }
    };
    fetchFacilities();
  }, []);

  const handleSlotToggle = useCallback(
    (slot: string) => {
      if (isSessionDisabled(slot)) return;
      setSelectedSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot].sort()));
    },
    [isSessionDisabled]
  );

  const handleSubmit = async () => {
    if (!selectedFacility || !selectedDate || selectedSlots.length === 0) {
      setToast({ message: "Lengkapi semua field!", type: "error" });
      return;
    }

    if (!selectedUser) {
      setToast({ message: "Pilih user dari daftar yang valid!", type: "error" });
      return;
    }

    if (!checkSequentialSessions(selectedSlots)) {
      setToast({ message: "Jam booking harus berurutan!", type: "error" });
      return;
    }

    try {
      const sessionData = selectedSlots.map((label) => {
        const { startDate, endDate } = parseSessionToWIBDate(label, selectedDate);

        if (!label.includes(" - ") || !selectedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          throw new Error("Format label atau tanggal tidak sesuai");
        }

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          throw new Error("Format waktu sesi tidak valid");
        }

        const addHours = (date: Date, hours: number) => new Date(date.getTime() + hours * 60 * 60 * 1000);

        return {
          start_time: addHours(startDate, 7).toISOString(),
          end_time: addHours(endDate, 7).toISOString(),
          session_label: label,
        };
      });

      const response = await fetch("/api/bookings/addBookingByAdmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          facilityId: selectedFacility.id,
          booking_date: selectedDate,
          total_price: totalPrice,
          sessions: sessionData,
        }),
      });

      if (!response.ok) throw new Error("Gagal membuat booking");

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setToast({ message: "Reservasi berhasil!", type: "success" });
      setSelectedDate("");
      setSelectedFacility(null);
      setSelectedSlots([]);
      setSelectedUser(null);
      setSearchInput("");
    } catch (err) {
      console.error("Booking gagal:", err);
      setToast({ message: "Gagal melakukan booking", type: "error" });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <DashboardLayout title="Reservasi Lapangan">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-xl mt-8">
          <div className="sticky top-20 bg-white z-[10] py-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-900 ">Reservasi Lapangan (Admin)</h1>

            {/* User Info */}
            <div className="mb-6 relative">
              <label className="block text-gray-700 font-semibold mb-1">Nama User</label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setSelectedUser(null); // reset jika edit
                }}
                className="w-full px-4 py-2 border rounded-md text-black"
                placeholder="Ketik nama user..."
              />
              {filteredUsers.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 z-10 max-h-60 overflow-y-auto shadow-lg">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchInput(user.fullname);
                        setFilteredUsers([]);
                      }}
                      className="px-4 py-2 hover:bg-green-100 cursor-pointer text-sm text-blue-900"
                    >
                      {user.fullname}
                    </div>
                  ))}
                </div>
              )}
              {noUserFound && <div className="text-red-500 text-sm mt-1">User tidak ditemukan</div>}
            </div>
          </div>

          {/* Facility Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Pilih Lapangan</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {facilities.map((facility) => (
                <motion.div
                  key={facility.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedFacility(facility)}
                  className={`cursor-pointer border rounded-lg overflow-hidden shadow-md transition-all duration-200 ${selectedFacility?.id === facility.id ? "ring-2 ring-green-500" : ""}`}
                >
                  <Image src={`/assets/field/${facility.field_image}`} alt={facility.field_name} width={300} height={200} className="object-cover w-full h-36" />
                  <div className="p-3 bg-white">
                    <h3 className="font-semibold text-gray-800 text-base">{facility.field_name}</h3>
                    <p className="text-sm text-gray-600">Rp. {Number(facility.price_per_session).toLocaleString("id-ID")}/sesi</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Booking Date */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Tanggal Booking</label>
            <input type="date" min={today} value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full px-4 py-2 border rounded-md text-black" />
          </div>

          {/* Session Selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Pilih Jam</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {sessions.map((session) => {
                const isSelected = selectedSlots.includes(session);
                const isInvalid = invalidSessions.includes(session);
                const isDisabled = isSessionDisabled(session);
                return (
                  <motion.button
                    key={session}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => !isDisabled && handleSlotToggle(session)}
                    disabled={isDisabled}
                    className={`text-xs sm:text-sm border px-2 py-1 rounded font-medium ${
                      isDisabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
                        : isSelected
                        ? "bg-green-600 text-white cursor-pointer"
                        : isInvalid
                        ? "bg-red-100 text-red-600 border-red-300 cursor-pointer"
                        : "bg-white text-gray-700 hover:bg-green-100 cursor-pointer"
                    }`}
                  >
                    {session}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-6 border-t pt-4">
            <div className="text-base sm:text-lg font-semibold text-gray-800">Durasi: {duration} jam</div>
            <div className="text-base sm:text-lg font-semibold text-gray-800">
              Total: <span className="text-green-700">Rp. {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: selectedUser && selectedFacility && selectedSlots.length > 0 ? 1.01 : 1 }}
            onClick={() => setShowConfirmModal(true)}
            disabled={!selectedUser || !selectedFacility || selectedSlots.length === 0}
            className={`mt-8 w-full py-3 rounded-lg font-semibold transition duration-200 ${
              !selectedUser || !selectedFacility || selectedSlots.length === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            }`}
          >
            Reservasi Sekarang
          </motion.button>
        </motion.div>

        <BookingConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleSubmit}
          selectedUser={selectedUser}
          selectedFacility={selectedFacility}
          selectedDate={selectedDate}
          selectedSlots={selectedSlots}
          totalPrice={totalPrice}
        />
      </DashboardLayout>
    </>
  );
}
