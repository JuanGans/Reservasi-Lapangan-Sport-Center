import React, { useEffect, useState } from "react";
import { Booking } from "@/types/booking";
import BookingCardItem from "./BookingCardItem";
import BookingDetailModal from "../booking/PopupBookingDetail";
import { AnimatePresence } from "framer-motion";

type BookingListCardProps = {
  bookings: Booking[];
  filterStatus: "all" | Booking["booking_status"];
  setFilterStatus: (status: "all" | Booking["booking_status"]) => void;
  role: string;
};

const BookingListCard: React.FC<BookingListCardProps> = ({ bookings, filterStatus, role }) => {
  const [index, setIndex] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  useEffect(() => {
    document.body.style.overflow = selectedBooking ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBooking]);

  const handleDetailClick = (id: number) => {
    const booking = bookings.find((b) => b.id === id) || null;
    setIndex(index);
    setSelectedBooking(booking);
  };

  const handleCloseModal = () => setSelectedBooking(null);

  const filteredBookings = bookings.filter((booking) => (filterStatus === "all" ? true : booking.booking_status === filterStatus));

  useEffect(() => {
    document.body.style.overflow = selectedBooking ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedBooking]);

  return (
    <div className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-blue-900 mb-2">Riwayat Booking</h2>

      {filteredBookings.length === 0 ? (
        <div className="text-gray-500 text-center py-6 border rounded-md bg-white shadow-sm">Tidak ada booking ditemukan.</div>
      ) : (
        filteredBookings.map((booking, index) => <BookingCardItem key={booking.id} booking={booking} role={role} index={index} onDetail={handleDetailClick} />)
      )}

      {/* Modal Detail */}
      <AnimatePresence mode="wait">{selectedBooking && <BookingDetailModal key={index} booking={selectedBooking} index={index} role={role} onClose={handleCloseModal} />}</AnimatePresence>
    </div>
  );
};

export default BookingListCard;
