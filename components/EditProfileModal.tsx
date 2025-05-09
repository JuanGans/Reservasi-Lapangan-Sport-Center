import React, { useState } from 'react';
import Image from 'next/image';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { name: string, profilePicture: File | null }) => void;
  initialData?: {
    name: string;
    profilePictureUrl?: string;
  };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData = { name: '', profilePictureUrl: '' }
}) => {
  const [name, setName] = useState(initialData.name);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialData.profilePictureUrl || '');
  const [isDragging, setIsDragging] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProfilePicture(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setProfilePicture(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
    }
  };

  const handleSubmit = () => {
    onSave({ name, profilePicture });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-6">Edit Profile</h2>
        
        {/* Profile Image */}
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200">
            {previewUrl ? (
              <Image 
                src={previewUrl} 
                alt="Profile Preview" 
                fill 
                className="object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        
        {/* Upload Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
          <div 
            className={`border-2 border-dashed rounded-md p-4 text-center ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
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
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors"
          >
            Batalkan
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;