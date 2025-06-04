import React, { useState, useEffect, useRef } from "react";
import { Facility } from "@/types/facility";

const Carousel = ({ facilities }: { facilities: Facility[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("User");
  const [isLoading, setIsLoading] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % facilities.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + facilities.length) % facilities.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 5000);
    return () => clearInterval(interval);
  }, [facilities.length]);

  useEffect(() => {
    async function fetchUserName() {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        setName(data.username || "User");
      } catch {
        setName("User");
      } finally {
        setIsLoading(false);
      }
    }
    fetchUserName();
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const deltaX = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (deltaX > threshold) handleNext();
    else if (deltaX < -threshold) handlePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 px-4 py-6 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-6 text-center">Selamat Datang, {isLoading ? <span className="inline-block h-5 w-24 bg-gray-300 rounded animate-pulse" /> : name}!</h1>

      <div className="relative w-full max-w-5xl mx-auto overflow-hidden rounded-2xl shadow-xl bg-white" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        {isLoading ? (
          <div className="flex w-full h-72 bg-gray-200 animate-pulse rounded-xl items-center justify-center">
            <div className="text-gray-400 text-sm">Memuat data lapangan...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-flow-col auto-cols-[100%] transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {facilities.map((field) => (
                <div key={field.id} className="h-[300px] relative bg-gray-200 rounded-xl overflow-hidden">
                  <img src={field.field_image ? `/assets/field/${field.field_image}` : "assets/field/fallback.jpg"} alt={field.field_name} className="absolute inset-0 w-full h-full object-cover object-center" />

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white rounded-b-xl">
                    <h3 className="text-lg font-semibold">{field.field_name}</h3>
                    <p className="text-sm">Rp {parseInt(field.price_per_session).toLocaleString()} / sesi</p>
                    {field.avg_rating !== undefined && <p className="text-yellow-300 text-sm mt-1">⭐ {field.avg_rating.toFixed(1)} / 5</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigasi panah */}
            <button onClick={handlePrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 backdrop-blur p-2 rounded-full text-white text-xl shadow cursor-pointer">
              ‹
            </button>
            <button onClick={handleNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 bg-white/40 hover:bg-white/60 backdrop-blur p-2 rounded-full text-white text-xl shadow cursor-pointer">
              ›
            </button>
          </>
        )}
      </div>

      {/* Dots */}
      {!isLoading && (
        <div className="flex justify-center mt-5 space-x-2">
          {facilities.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? "bg-blue-600 w-6" : "bg-gray-400 w-2"}`}></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
