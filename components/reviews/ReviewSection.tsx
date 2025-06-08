// ("use client");

import React, { useState } from "react";
import { Review } from "@/types/review";
import { AnimatePresence, motion } from "framer-motion";

export default function ReviewSection({ reviews }: { reviews: Review[] }) {
  const [showAll, setShowAll] = useState(false);

  const visibleReviews = showAll ? reviews : reviews.slice(0, 4);

  const toggleShowAll = () => setShowAll((prev) => !prev);

  return (
    <div className="my-10">
      <h2 className="text-2xl font-semibold text-blue-900 mb-6">Ulasan Pengguna</h2>

      {reviews.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada ulasan untuk lapangan ini.</p>
      ) : (
        <>
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 no-scrollbar">
            <AnimatePresence initial={false}>
              {visibleReviews.map((review, index) => (
                <motion.div key={index} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={review.user_img ? `/assets/user/${review.user_img}` : "/assets/user/default-user.jpg"} alt={review.user_img || "User avatar"} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-blue-900">{review.username}</p>
                      <div className="text-yellow-500 text-sm">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <i key={i} className="fas fa-star" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {reviews.length > 4 && (
            <motion.div layout className="mt-6 text-center">
              <motion.button whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.03 }} onClick={toggleShowAll} className="text-blue-600 font-medium hover:underline cursor-pointer">
                {showAll ? "Sembunyikan ulasan" : `Lihat lebih banyak ulasan (${reviews.length - 4} lagi)`}
              </motion.button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
