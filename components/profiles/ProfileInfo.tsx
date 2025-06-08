import React from "react";

interface ProfileData {
  id: number;
  username: string;
  fullname: string;
  email: string;
  no_hp: string;
  user_img: string;
  role: string;
}

interface ProfileInfoProps {
  profileData: ProfileData;
  openProfileModal: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ profileData, openProfileModal }) => {
  return (
    <div className="p-4 sm:p-6 bg-white rounded-md shadow-sm">
      <h2 className="text-lg sm:text-xl font-semibold text-blue-900 mb-4 sm:mb-6">Profil</h2>

      <div className="border rounded-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-gray-200">
              <img src={`/assets/user/${profileData.user_img}`} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-semibold text-base sm:text-lg text-blue-900">{profileData.username}</h3>
              <p className="text-gray-500 text-sm">ID Account: {profileData.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4">
        <h3 className="font-semibold text-base sm:text-lg text-blue-900 mb-3">Informasi Pribadi</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm mb-1">Nama Panjang</p>
            <p className="text-gray-800 text-sm">{profileData.fullname}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Email</p>
            <p className="text-gray-800 text-sm break-all">{profileData.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Nomor Handphone</p>
            <p className="text-gray-800 text-sm">{profileData.no_hp}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="bg-blue-500 text-white px-4 py-2 text-sm sm:text-base rounded-md hover:bg-blue-600 transition duration-200 cursor-pointer" onClick={openProfileModal}>
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
