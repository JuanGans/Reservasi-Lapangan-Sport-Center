import React, { useState, useEffect, useRef } from "react";

interface Facility {
  id: number;
  field_name: string;
  field_image: string;
  price_per_session: string;
  avg_rating?: number;
  total_review?: number;
}

const Carousel = ({ facilities }: { facilities: Facility[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [name, setName] = useState("User");
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
      <h1 className="text-xl sm:text-2xl font-semibold text-blue-900 mb-6 text-center">Selamat Datang, {name}!</h1>

      <div className="relative w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-hidden rounded-xl shadow-lg" onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)`, width: `${facilities.length * 100}%` }}>
          {facilities.map((field) => (
            <div key={field.id} className="w-full flex-shrink-0 h-64 relative ">
              <img src={field.field_image || "assets/field/fallback.jpg"} alt={field.field_name} className="w-full h-[300px] sm:h-[360px] md:h-[420px] object-cover rounded-xl" />
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
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-5 space-x-2">
        {facilities.map((_, i) => (
          <button key={i} onClick={() => goToSlide(i)} className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${i === currentIndex ? "bg-blue-600 w-6" : "bg-gray-400 w-2"}`}></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
