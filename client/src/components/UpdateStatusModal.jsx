import React, { useState } from 'react';
import { FaTimes, FaCheck, FaSpinner } from 'react-icons/fa';

const UpdateStatusModal = ({ isOpen, onClose, application, onStatusUpdate }) => {
  const [status, setStatus] = useState(application?.status || 'Pending');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const statusOptions = [
    { value: 'Pending', label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'Reviewed', label: 'Đã xem xét', color: 'bg-blue-100 text-blue-800' },
    { value: 'Interviewing', label: 'Phỏng vấn', color: 'bg-purple-100 text-purple-800' },
    { value: 'Offer', label: 'Đề nghị', color: 'bg-green-100 text-green-800' },
    { value: 'Rejected', label: 'Từ chối', color: 'bg-red-100 text-red-800' },
    { value: 'Hired', label: 'Đã tuyển', color: 'bg-emerald-100 text-emerald-800' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!application?._id) {
      setError('Không tìm thấy thông tin đơn ứng tuyển');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('https://be-khoa-luan2.vercel.app/api/update-application-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId: application._id,
          status,
          note: note.trim() || undefined
        })
      });

      const data = await response.json();

      if (data.success) {
        // Gọi callback để cập nhật UI
        if (onStatusUpdate) {
          onStatusUpdate(application._id, status, note);
        }
        onClose();
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Lỗi kết nối server');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setStatus(application?.status || 'Pending');
      setNote('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Cập nhật trạng thái</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Application Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <h4 className="font-semibold text-gray-900 mb-2">Thông tin đơn ứng tuyển</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Ứng viên:</span> {application?.candidateName || 'N/A'}</p>
              <p><span className="font-medium">Công việc:</span> {application?.jobTitle || 'N/A'}</p>
              <p><span className="font-medium">Ngày nộp:</span> {new Date(application?.applicationDate).toLocaleDateString('vi-VN')}</p>
            </div>
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Trạng thái mới *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStatus(option.value)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    status === option.value
                      ? `${option.color} ring-2 ring-blue-500`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho ứng viên..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="3"
              disabled={isSubmitting}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <FaCheck className="w-4 h-4 mr-2" />
                  Cập nhật
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateStatusModal; 