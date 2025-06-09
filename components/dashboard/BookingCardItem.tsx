import { useState } from "react";
import { Booking, BookingStatus } from "@/types/booking";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  booking: Booking;
  index: number;
  role: string;
  onDetail: (id: number) => void;
};

const statusColor: Record<Exclude<BookingStatus, "all">, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  paid: "bg-blue-100 text-blue-700",
  confirmed: "bg-indigo-100 text-indigo-700",
  canceled: "bg-red-100 text-red-700",
  expired: "bg-gray-200 text-gray-700",
  review: "bg-purple-100 text-purple-700",
  completed: "bg-green-100 text-green-700",
};

const BookingCardItem: React.FC<Props> = ({ booking, index, onDetail, role }) => {
  const [isOpen, setIsOpen] = useState(false);

  const durasi = booking.sessions?.reduce((total, session) => {
    const start = new Date(session.start_time).getTime();
    const end = new Date(session.end_time).getTime();
    return total + (end - start) / (1000 * 60);
  }, 0);
  const durasiJam = durasi ? durasi / 60 : 0;

  return (
    <div className="bg-white shadow rounded-xl p-4 border border-gray-100 transition-all duration-300">
      {/* Header Ringkas */}
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div>
          <div className="text-sm font-medium text-gray-500">
            #{index + 1} {role == "admin" && booking.user?.username}
          </div>
          <div className="text-base font-semibold text-gray-800">{booking.facility?.field_name || "-"}</div>
          <div className="text-sm text-gray-600">
            {new Date(booking.booking_date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${booking.booking_status !== "all" ? statusColor[booking.booking_status] : ""}`}>{booking.booking_status}</span>
          <button
            className="flex items-center text-xs text-blue-600 font-medium hover:text-blue-800 transition gap-1 mt-1 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <>
                Tutup <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Lihat <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Detail dengan animasi */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden mt-3">
            <div className="space-y-2 text-sm text-gray-700">
              <div>
                <strong>Sesi:</strong>{" "}
                {booking.sessions && booking.sessions.length > 0 ? (
                  <ul className="list-disc list-inside">
                    {booking.sessions.map((session) => (
                      <li key={session.id}>{session.session_label}</li>
                    ))}
                  </ul>
                ) : (
                  <span>-</span>
                )}
              </div>

              <div>
                <strong>Durasi:</strong> {durasiJam} Jam
              </div>

              <div>
                <strong>Total:</strong> {booking.total_price !== undefined ? `Rp. ${booking.total_price.toLocaleString("id-ID")}` : "-"}
              </div>

              <div className="pt-2">
                <button onClick={() => onDetail(booking.id)} className="w-full text-center px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition cursor-pointer">
                  Lihat Detail
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingCardItem;
