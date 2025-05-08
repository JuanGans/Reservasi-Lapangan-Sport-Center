import React from "react";

const Event: React.FC = () => {
  return (
    // EVENT
    <section className="bg-white rounded-lg p-4 shadow-md flex flex-col space-y-4">
      <h3 className="text-[#0C2D48] font-extrabold text-lg">Event Baru</h3>
      <div className="flex items-center space-x-3">
        <img alt="Missile" className="w-[100px] h-[70px] rounded-md object-cover" src="https://storage.googleapis.com/a1aa/image/705190b6-e58a-4468-94fd-794bcdfaed10.jpg" />
        <div>
          <p className="text-[#0C2D48] font-semibold text-sm leading-tight">Missile</p>
          <p className="text-xs text-gray-500 leading-tight">Lorem Ipsum</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <img alt="Gun" className="w-[100px] h-[70px] rounded-md object-cover" src="https://storage.googleapis.com/a1aa/image/024c47c2-74b1-43f6-8e28-5e852b74a73a.jpg" />
        <div>
          <p className="text-[#0C2D48] font-semibold text-sm leading-tight">Gun</p>
          <p className="text-xs text-gray-500 leading-tight">Lorem Ipsum</p>
        </div>
      </div>
    </section>
  );
};

export default Event;
