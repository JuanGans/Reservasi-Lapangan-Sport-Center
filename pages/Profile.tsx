import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import EditProfileModal from '../components/EditProfileModal';
import EditAccountModal from '../components/EditAccountModal';
import EditPersonalInfoModal from '../components/EditPersonalInfoModal';

const Profile = () => {
  // State to manage which tab is active
  const [activeTab, setActiveTab] = useState('profil');

  // State for modal visibility and animation
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfileModalAnimating, setIsProfileModalAnimating] = useState(false);
  
  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isPersonalInfoModalAnimating, setIsPersonalInfoModalAnimating] = useState(false);
  
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAccountModalAnimating, setIsAccountModalAnimating] = useState(false);

  // User profile data (you would fetch this from your API)
  const [profileData, setProfileData] = useState({
    name: 'Roy Frence',
    accountId: 'id_3381948382',
    fullName: 'Someone',
    email: 'Someone@gmail.com',
    phone: '(62) 8381867837281',
    address: 'United State, America',
    username: '3381948382',
    password: '•••••••••••••',
    profilePictureUrl: '/api/placeholder/100/100' // Using placeholder image instead of external URL
  });

  // Modal animation handlers
  const openProfileModal = () => {
    setIsProfileModalOpen(true);
    setTimeout(() => setIsProfileModalAnimating(true), 50);
  };

  const closeProfileModal = () => {
    setIsProfileModalAnimating(false);
    setTimeout(() => setIsProfileModalOpen(false), 300); // Animation duration
  };

  const openPersonalInfoModal = () => {
    setIsPersonalInfoModalOpen(true);
    setTimeout(() => setIsPersonalInfoModalAnimating(true), 50);
  };

  const closePersonalInfoModal = () => {
    setIsPersonalInfoModalAnimating(false);
    setTimeout(() => setIsPersonalInfoModalOpen(false), 300);
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
    setTimeout(() => setIsAccountModalAnimating(true), 50);
  };

  const closeAccountModal = () => {
    setIsAccountModalAnimating(false);
    setTimeout(() => setIsAccountModalOpen(false), 300);
  };

  // Handle profile updates
  const handleProfileSave = (data) => {
    setProfileData({
      ...profileData,
      name: data.name,
      // If you have a backend, you'd upload the image and get a URL back
      // For now, we'll just use a placeholder image
      profilePictureUrl: data.profilePicture ? '/api/placeholder/100/100' : profileData.profilePictureUrl
    });
    closeProfileModal();
  };

  // Handle personal info updates
  const handlePersonalInfoSave = (data) => {
    setProfileData({
      ...profileData,
      email: data.email,
      phone: data.phone
    });
    closePersonalInfoModal();
  };

  // Handle account updates
  const handleAccountSave = (data) => {
    setProfileData({
      ...profileData,
      username: data.username,
      password: data.password ? '•••••••••••••' : profileData.password // Keep the password masked
    });
    closeAccountModal();
  };

  // Render the content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Profil</h2>
            
            <div className="border rounded-md p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4 overflow-hidden bg-gray-200">
                    <img src={profileData.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{profileData.name}</h3>
                    <p className="text-gray-500 text-sm">Account {profileData.accountId}</p>
                  </div>
                </div>
                <button 
                  className="text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-sm"
                  onClick={openProfileModal}
                >
                  Edit
                </button>
              </div>
            </div>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Informasi Pribadi</h3>
                <button 
                  className="text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-sm"
                  onClick={openPersonalInfoModal}
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 mb-1">Nama Panjang</p>
                  <p className="font-medium">{profileData.fullName}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-medium">{profileData.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Nomor Handphone</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
                {/* <div>
                  <p className="text-gray-500 mb-1">Alamat</p>
                  <p className="font-medium">{profileData.address}</p>
                </div> */}
              </div>
            </div>
          </div>
        );
      
      case 'keamanan':
        return (
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Keamanan</h2>
            
            <div className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Account Information</h3>
                <button 
                  className="text-blue-500 border border-blue-500 rounded-full px-3 py-1 text-sm"
                  onClick={openAccountModal}
                >
                  Edit
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 mb-1">Username</p>
                  <p className="font-medium">{profileData.username}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Password</p>
                  <p className="font-medium">{profileData.password}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'hapus-akun':
        return (
          <div className="p-6 bg-white rounded-md shadow-sm">
            <h2 className="text-xl font-semibold text-blue-900 mb-6">Hapus Akun</h2>
            
            <p className="mb-4 text-gray-600">
              Peringatan bahwa jika Anda menghapus akun Anda, semua pesan dan notifikasi Anda akan terhapus dan tidak dapat diambil kembali. Ini adalah tindakan permanen.
            </p>
            
            <p className="mb-4 text-gray-600">
              Peringatan lanjut bahwa menghapus akun Anda jika Anda menghapus akun Anda sekarang, mungkin tidak dapat memulihkan lagi selama beberapa hari.
            </p>
            
            <ul className="mb-6 pl-6 text-gray-600 list-disc">
              <li>Jika Anda ingin menghapus informasi pribadi Anda, info profil tersebut akan menghapus sebagian tersebut. Info Lebih Lanjut.</li>
              <li>Jika akun Anda dihapus karena aktivitas tertentu selain menghapus akun tersebut, mengaktifkan akun tidak akan memulihkan informasi tersebut.</li>
            </ul>
            
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Kenapa ingin menghapus</h3>
              <textarea 
                className="w-full border rounded-md p-3" 
                placeholder="Berikan alasan!" 
                rows={5}
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">
                Hapus Akun
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <div className="flex flex-1">
        <Sidebar role="Customer" />
        
        <div className="flex-1 px-6 py-4 bg-gray-100">
          <h1 className="text-lg font-medium text-blue-900 mb-4">Akun</h1>
          
          <div className="bg-white rounded-md shadow-sm flex">
            {/* Sidebar Navigation */}
            <div className="w-64 border-r bg-white rounded-md">
              <nav className="p-4">
                <ul className="space-y-1">
                  <li>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-md ${activeTab === 'profil' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('profil')}
                    >
                      Profil
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-md ${activeTab === 'keamanan' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('keamanan')}
                    >
                      Keamanan
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left px-4 py-3 rounded-md ${activeTab === 'hapus-akun' ? 'bg-blue-100 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
                      onClick={() => setActiveTab('hapus-akun')}
                    >
                      Hapus Akun
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            
            {/* Content Area */}
            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals with Animation */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-grey-200 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 transform transition-all duration-300 ${
              isProfileModalAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>
            
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={profileData.profilePictureUrl} 
                  alt="Profile Preview" 
                  className="object-cover w-full h-full" 
                />
              </div>
            </div>
            
            {/* Name Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={profileData.name}
                placeholder="Enter your name"
              />
            </div>
            
            {/* Upload Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
              <div className="border-2 border-dashed rounded-md p-4 text-center border-gray-300">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-10 h-10 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p className="text-sm text-blue-600">Drag and drop your file here (optional)</p>
                  <p className="text-xs text-gray-500 mt-1">or</p>
                  <div className="mt-2">
                    <label htmlFor="file-upload" className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md cursor-pointer">
                      Browse your file
                    </label>
                    <input 
                      id="file-upload" 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={closeProfileModal}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={() => handleProfileSave({ name: profileData.name })}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {isPersonalInfoModalOpen && (
        <div className="fixed inset-0 bg-grey-200 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 transform transition-all duration-300 ${
              isPersonalInfoModalAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-lg font-semibold mb-6">Edit Informasi Personal</h2>
            
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={profileData.email}
                placeholder="Enter your email"
              />
            </div>
            
            {/* Phone Number Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Handphone</label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={profileData.phone}
                placeholder="Enter your phone number"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={closePersonalInfoModal}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={() => handlePersonalInfoSave({ email: profileData.email, phone: profileData.phone })}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {isAccountModalOpen && (
        <div className="fixed inset-0 bg-grey-200 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div 
            className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 transform transition-all duration-300 ${
              isAccountModalAnimating ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-lg font-semibold mb-6">Edit Informasi Akun</h2>
            
            {/* Username Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue={profileData.username}
                placeholder="Enter your username"
              />
            </div>
            
            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={closeAccountModal}
                className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
              >
                Batalkan
              </button>
              <button
                onClick={() => handleAccountSave({ username: profileData.username })}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;