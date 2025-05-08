import React, { useEffect, useState } from 'react';

interface ConfirmationPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Kembali',
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setAnimateIn(true), 20); // trigger animasi masuk
    } else {
      setAnimateIn(false);
      const timeout = setTimeout(() => setShouldRender(false), 300); // tunggu animasi keluar
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gray-900 bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 ${
    animateIn ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={onCancel}
      />

      {/* Popup box */}
      <div
        className={`bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative z-10 transform transition-all duration-300 ${
          animateIn ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
        }`}
      >
        <div className="px-6 py-6">
          <h2 className="text-2xl font-medium text-center mb-4">{title}</h2>
          <p className="text-center text-gray-700 mb-6">{message}</p>

          <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <button
              onClick={onCancel}
              className="w-full sm:w-1/2 py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="w-full sm:w-1/2 py-3 px-4 bg-red-700 text-white rounded-lg font-medium"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
