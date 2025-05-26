import React from "react";

interface ProfileHeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="mb-4">
      <h1 className="text-lg font-bold text-blue-900 mb-2">Akun</h1>
      <nav className="flex space-y-1">
        <button onClick={() => setActiveTab("profil")} className={`w-full text-left px-4 py-3 rounded-md cursor-pointer ${activeTab === "profil" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
          Profil
        </button>
        <button onClick={() => setActiveTab("keamanan")} className={`w-full text-left px-4 py-3 rounded-md cursor-pointer ${activeTab === "keamanan" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
          Keamanan
        </button>
        <button onClick={() => setActiveTab("hapus-akun")} className={`w-full text-left px-4 py-3 rounded-md cursor-pointer ${activeTab === "hapus-akun" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"}`}>
          Hapus Akun
        </button>
      </nav>
    </div>
  );
};

export default ProfileHeader;
