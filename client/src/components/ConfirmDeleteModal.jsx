import React from 'react';

const ConfirmDeleteModal = ({ open, onClose, onConfirm, message = 'Bạn có chắc chắn muốn xóa employer này? Hành động này không thể hoàn tác và sẽ xóa tất cả dữ liệu liên quan.' }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
        <h2 className="text-xl font-bold text-red-600 mb-4">Xác nhận xóa</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal; 