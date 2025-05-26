"use client";
import { useState, useEffect, useRef } from "react";
import LandingAnimation from "@/components/animation/LandingAnimation";

const reviews = [
  {
    name: "Alifia Bilqi Firajulkha",
    text: "Pengalaman booking lapangan jadi lebih simpel dan cepat. Desain websitenya juga sangat user-friendly!",
    image: "alifia.jpg",
  },
  {
    name: "Ellois Karina Handoyo",
    text: "Saya bisa langsung pesan tanpa harus antri di tempat. Fasilitas yang ditampilkan sangat informatif.",
    image: "ello.jpg",
  },
  {
    name: "Juan Felix Antonio Nathan Tote",
    text: "JTI Sport Center sekarang terasa lebih modern! Saya suka kemudahan melihat jadwal kosong.",
    image: "juan.jpg",
  },
  {
    name: "Mochamad Imam Hanafi",
    text: "Sangat membantu bagi mahasiswa yang aktif di olahraga. Booking jadi fleksibel kapan pun dibutuhkan.",
    image: "imam.jpg",
  },
  {
    name: "Zhubair Abhel Frisky Maulana Zidhane",
    text: "Fitur dan tampilannya kekinian. Saya rekomendasikan untuk semua warga JTI yang ingin olahraga terjadwal.",
    image: "abhel.jpg",
  },
];

export default function ReviewCarousel() {
  const extendedReviews = [reviews[reviews.length - 1], ...reviews, reviews[0]];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slideWidthRef = useRef(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const gap = 24;

  useEffect(() => {
    const updateSlideWidth = () => {
      if (containerRef.current) {
        const container = containerRef.current.parentElement;
        slideWidthRef.current = container ? container.clientWidth : 0;
        containerRef.current.style.transition = "none";
        containerRef.current.style.transform = `translateX(-${slideWidthRef.current * currentIndex}px)`;
      }
    };
    updateSlideWidth();
    window.addEventListener("resize", updateSlideWidth);
    return () => window.removeEventListener("resize", updateSlideWidth);
  }, []);

  useEffect(() => {
    if (isTransitioning) return;
    const interval = setInterval(() => slideNext(), 4000);
    return () => clearInterval(interval);
  }, [currentIndex, isTransitioning]);

  const slideNext = () => {
    if (!isTransitioning && containerRef.current) {
      setIsTransitioning(true);
      const newIndex = currentIndex + 1;
      containerRef.current.style.transition = "transform 0.5s ease";
      containerRef.current.style.transform = `translateX(-${slideWidthRef.current * newIndex}px)`;
      setCurrentIndex(newIndex);
    }
  };

  const slidePrev = () => {
    if (!isTransitioning && containerRef.current) {
      setIsTransitioning(true);
      const newIndex = currentIndex - 1;
      containerRef.current.style.transition = "transform 0.5s ease";
      containerRef.current.style.transform = `translateX(-${slideWidthRef.current * newIndex}px)`;
      setCurrentIndex(newIndex);
    }
  };

  const handleTransitionEnd = () => {
    if (!containerRef.current) return;
    setIsTransitioning(false);

    if (currentIndex === extendedReviews.length - 1) {
      containerRef.current.style.transition = "none";
      setCurrentIndex(1);
      containerRef.current.style.transform = `translateX(-${slideWidthRef.current}px)`;
    } else if (currentIndex === 0) {
      containerRef.current.style.transition = "none";
      setCurrentIndex(extendedReviews.length - 2);
      containerRef.current.style.transform = `translateX(-${slideWidthRef.current * (extendedReviews.length - 2)}px)`;
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) slideNext();
    else if (diff < -50) slidePrev();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section id="review" className="relative text-center py-16 px-4 overflow-hidden bg-gradient-to-b from-blue-100 to-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
        style={{
          backgroundImage: "url('https://c4.wallpaperflare.com/wallpaper/483/576/977/abstract-hexagon-simple-minimalism-wallpaper-preview.jpg')",
        }}
      ></div>
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <LandingAnimation>
          <h2 className="text-2xl font-bold text-blue-900 mb-10">Apa Kata Pengguna Kami?</h2>
        </LandingAnimation>

        <LandingAnimation>
          <div className="overflow-hidden w-full relative">
            {/* Arrows for desktop */}
            <div className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-20">
              <button onClick={slidePrev} className="bg-white/70 hover:bg-white hover:text-blue-900 transition rounded-full p-2 shadow-md cursor-pointer" aria-label="Previous">
                ◀
              </button>
            </div>
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-20">
              <button onClick={slideNext} className="bg-white/70 hover:bg-white hover:text-blue-900 transition rounded-full p-2 shadow-md cursor-pointer" aria-label="Next">
                ▶
              </button>
            </div>

            <div className="flex transition-transform duration-500 ease-in-out" ref={containerRef} onTransitionEnd={handleTransitionEnd} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
              {extendedReviews.map((review, i) => (
                <div key={i} className="flex-shrink-0 px-3" style={{ width: "100%" }}>
                  <div className="bg-white p-6 md:p-8 rounded-xl shadow-md flex flex-col items-center max-w-2xl mx-auto text-center">
                    <img src={`./assets/team/${review.image}`} alt={review.name} className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mb-4 border-2 border-blue-500" />
                    <p className="text-gray-700 text-sm md:text-base mb-3 leading-relaxed">“{review.text}”</p>
                    <div className="text-yellow-400 text-lg mb-2">★★★★★</div>
                    <p className="text-blue-900 font-semibold text-base md:text-lg">{review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </LandingAnimation>

        <LandingAnimation>
          <div className="flex justify-center mt-8 space-x-3">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (isTransitioning) return;
                  setCurrentIndex(idx + 1);
                  if (containerRef.current) {
                    containerRef.current.style.transition = "transform 0.5s ease";
                    containerRef.current.style.transform = `translateX(-${slideWidthRef.current * (idx + 1)}px)`;
                  }
                }}
                className={`w-4 h-4 cursor-pointer rounded-full transition-colors ${idx + 1 === currentIndex ? "bg-blue-900" : "bg-blue-300"}`}
                aria-label={`Go to review ${idx + 1}`}
              />
            ))}
          </div>
        </LandingAnimation>
      </div>
    </section>
  );
}
