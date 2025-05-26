import React from "react";

interface StatusCardProps {
  title: string;
  count: number;
  description: string;
  icon: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ title, count, description, icon }) => {
  return (
    <>
      <div className="bg-white rounded-xl p-4 flex flex-col justify-between relative" style={{ minHeight: "110px" }}>
        <div className="flex justify-between items-center mb-2">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <i className={`text-gray-600 text-xs ${icon}`}></i>
        </div>
        <p className="text-4xl font-extrabold text-black leading-none">{count}</p>
        <p className="text-[10px] text-gray-600 mt-2">{description}</p>
      </div>
    </>
  );
};

export default StatusCard;
