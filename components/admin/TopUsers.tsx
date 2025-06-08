// components/dashboard/TopUsers.tsx
import React from "react";

interface UserStats {
  username: string;
  bookings: number;
}

const TopUsers: React.FC<{ users: UserStats[] }> = ({ users }) => (
  <div className="bg-white shadow rounded-lg p-5">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Pengguna Aktif</h2>
    <ul className="text-gray-700">
      {users.map((user, idx) => (
        <li key={idx} className="flex justify-between py-2 border-b border-gray-200">
          <span>{user.username}</span>
          <span className="font-semibold">{user.bookings}x booking</span>
        </li>
      ))}
    </ul>
  </div>
);

export default TopUsers;
