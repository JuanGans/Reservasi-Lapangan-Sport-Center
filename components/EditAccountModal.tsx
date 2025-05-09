import React, { useState } from 'react';

interface EditAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { username: string, password: string }) => void;
  initialData?: {
    username: string;
  };
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = { username: '' }
}) => {
  const [username, setUsername] = useState(initialData.username);
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ username, password });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-6">Edit Informasi Akun</h2>
        
        {/* Username Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
        </div>
        
        {/* Password Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
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

export default EditAccountModal;