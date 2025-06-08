// components/dashboard/StatsCard.tsx
import React from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, color }) => (
  <div className="bg-white shadow rounded-lg p-5">
    <p className="text-sm text-gray-500">{label}</p>
    <p className={`lg:text-2xl text-3xl font-bold mt-1 ${color}`}>{value}</p>
  </div>
);

export default StatsCard;
