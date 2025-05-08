import React from "react";

const Calendar: React.FC = () => {
  return (
    // HEADER
    <section className="bg-white rounded-lg p-4 shadow-md text-center text-[#0C2D48]">
      <h3 className="font-extrabold text-base mb-3">November 2023</h3>
      <div className="grid grid-cols-7 gap-1 text-xs font-semibold">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className={`flex items-center justify-center ${i === 10 ? "bg-[#D9E9F4] rounded-full w-6 h-6" : ""}`}>
            {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Calendar;
