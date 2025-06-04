import React from "react";

interface ProfileData {
  username: string;
}

interface SecurityInfoProps {
  profileData: ProfileData;
  openAccountModal: () => void;
}

const SecurityInfo: React.FC<SecurityInfoProps> = ({ profileData, openAccountModal }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 sm:mb-6">Keamanan</h2>

      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-base sm:text-lg text-blue-900 mb-4">Informasi Akun</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Username</p>
            <p className="text-gray-800 text-sm break-words">{profileData.username}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Password</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-800 text-sm">•••••••••••••</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button onClick={openAccountModal} className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-600 transition duration-200">
            Ubah Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecurityInfo;
