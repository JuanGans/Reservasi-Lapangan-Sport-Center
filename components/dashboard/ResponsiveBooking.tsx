import React from "react";
import { Booking } from "@/types/booking";
import BookingTable from "./BookingTable";
import BookingListCard from "./BookingCard";

type Props = {
  bookings: Booking[];
  filterStatus: "all" | Booking["booking_status"];
  setFilterStatus: (status: "all" | Booking["booking_status"]) => void;
  role: string;
};

const ResponsiveBookingView: React.FC<Props> = ({ bookings, filterStatus, setFilterStatus, role }) => {
  return (
    <>
      {/* Desktop: Table View */}
      <div className="hidden md:block">
        <BookingTable bookings={bookings} filterStatus={filterStatus} setFilterStatus={setFilterStatus} role={role} />
      </div>

      {/* Mobile: Card View */}
      <div className="block md:hidden">
        <BookingListCard bookings={bookings} filterStatus={filterStatus} setFilterStatus={setFilterStatus} role={role} />
      </div>
    </>
  );
};

export default ResponsiveBookingView;
