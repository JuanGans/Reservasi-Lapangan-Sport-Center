import React from "react";

interface User {
  fullname?: string;
  username?: string;
  email?: string;
  no_hp?: string;
  user_img?: string;
}

interface StepDataDiriProps {
  user: User | null | undefined;
}

const StepDataDiri: React.FC<StepDataDiriProps> = ({ user }) => {
  return (
    <div className="flex flex-col items-center text-center mt-10">
      <img src={user?.user_img ? `/assets/user/${user?.user_img}` : "/assets/user/default-avatar.jpg"} alt="User Avatar" className="w-20 h-20 rounded-full object-cover border shadow mb-5" />
      <h2 className="text-xl font-semibold mb-2 text-blue-800">Data Diri Anda</h2>
      <p className="text-sm text-gray-500 mb-6">Pastikan data diri Anda sudah sesuai sebelum melakukan booking.</p>

      <div className="w-full flex flex-col sm:flex-row gap-6 items-center sm:items-start sm:justify-center">
        <div className="text-left space-y-1 text-gray-700 text-sm w-full max-w-xs">
          <div>
            <span className="font-medium">Nama Lengkap:</span> {user?.fullname || "-"}
          </div>
          <div>
            <span className="font-medium">Username:</span> {user?.username || "-"}
          </div>
          <div>
            <span className="font-medium">Email:</span> {user?.email || "-"}
          </div>
          <div>
            <span className="font-medium">No HP:</span> {user?.no_hp || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepDataDiri;
