import React, { useState, useEffect } from 'react';
import { FaTimes, FaDownload, FaSpinner, FaFilePdf, FaFileAlt } from 'react-icons/fa';

const CVViewerModal = ({ isOpen, onClose, cvUrl, candidateName }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (isOpen && cvUrl) {
      setLoading(true);
      setError(null);
      
      if (cvUrl.startsWith('data:application/pdf;base64,')) {
        // Xử lý base64 PDF
        try {
          const byteCharacters = atob(cvUrl.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
          setLoading(false);
        } catch (err) {
          setError('Không thể tải CV');
          setLoading(false);
        }
      } else {
        // Xử lý URL thông thường
        setPdfUrl(cvUrl);
        setLoading(false);
      }
    }
  }, [isOpen, cvUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = `CV_${candidateName || 'Candidate'}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleClose = () => {
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      window.URL.revokeObjectURL(pdfUrl);
    }
    setPdfUrl(null);
    setLoading(false);
    setError(null);
    onClose();
  };

  // Đóng modal khi nhấn ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <FaFilePdf className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Xem CV</h3>
                  <p className="text-sm text-indigo-100">
                    {candidateName || 'Ứng viên'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleDownload}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  title="Tải CV"
                >
                  <FaDownload className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }}></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Đang tải CV...</p>
                </div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaFileAlt className="w-8 h-8 text-red-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải CV</h4>
                  <p className="text-gray-500">{error}</p>
                </div>
              </div>
                         ) : (
               <div className="h-96 sm:h-[600px]">
                 <iframe
                   src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                   className="w-full h-full border-0"
                   title="CV Viewer"
                   onError={() => setError('Không thể hiển thị CV')}
                 />
                 {/* Fallback link nếu iframe không hoạt động */}
                 <div className="p-4 text-center border-t border-gray-200">
                   <p className="text-sm text-gray-500 mb-2">
                     Nếu CV không hiển thị, bạn có thể
                   </p>
                   <a
                     href={pdfUrl}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                   >
                     Mở CV trong tab mới
                   </a>
                 </div>
               </div>
             )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                CV của {candidateName || 'ứng viên'}
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                >
                  <FaDownload className="w-3 h-3 mr-1" />
                  Tải CV
                </button>
                <button
                  onClick={handleClose}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVViewerModal; 