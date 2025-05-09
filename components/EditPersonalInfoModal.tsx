import React, { useState } from 'react';

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: { email: string, phone: string }) => void;
  initialData?: {
    email: string;
    phone: string;
  };
}

const EditPersonalInfoModal: React.FC<EditPersonalInfoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData = { email: '', phone: '' }
}) => {
  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({ email, phone });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-6">Edit Informasi Personal</h2>
        
        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        
        {/* Phone Number Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Handphone</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your phone number"
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

export default EditPersonalInfoModal;