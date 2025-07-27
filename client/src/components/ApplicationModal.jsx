import React, { useState, useEffect } from 'react';
import { FaTimes, FaFileAlt, FaCheck, FaSpinner, FaPlus, FaEye } from 'react-icons/fa';
import { calculateProfileCompletion } from '../utils/profileCompletion';

const ApplicationModal = ({ isOpen, onClose, job, candidateId }) => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (isOpen && candidateId) {
      fetchResumes();
    }
  }, [isOpen, candidateId]);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Lấy thông tin profile và CV từ API cũ (CandidateProfile.jsx)
      const profileResponse = await fetch(`https://be-khoaluan.vercel.app/api/candidate/profile?userId=${candidateId}`);
      
      if (profileResponse.ok) {
        const profileResult = await profileResponse.json();
        if (profileResult.success && profileResult.data) {
          const profileData = profileResult.data;
          const profileCompletion = calculateProfileCompletion(profileData);
          
          setProfileData(profileData);
          setProfileCompletion(profileCompletion);
          
          // Lấy CV từ profile (API cũ)
          if (profileData?.cvUrl) {
            const profileResume = {
              _id: 'profile-cv',
              title: 'CV từ hồ sơ',
              fileName: 'CV.pdf',
              fileUrl: profileData.cvUrl,
              isPrimary: true,
              createdAt: new Date(),
              fromProfile: true
            };
            setResumes([profileResume]);
            setSelectedResume('profile-cv');
          } else {
            setResumes([]);
            setSelectedResume(null);
          }
        } else {
          setResumes([]);
          setSelectedResume(null);
          setProfileCompletion(0);
        }
      } else {
        setResumes([]);
        setSelectedResume(null);
        setProfileCompletion(0);
      }
    } catch (error) {
      console.error('Error fetching profile and CV:', error);
      setResumes([]);
      setSelectedResume(null);
      setProfileCompletion(0);
      setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (profileCompletion < 50) {
      setError('Hồ sơ chưa hoàn thiện. Cần hoàn thành ít nhất 50% để nộp đơn.');
      return;
    }
    
    if (!selectedResume) {
      setError('Vui lòng cập nhật CV trong hồ sơ cá nhân trước khi nộp đơn');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const selectedResumeData = resumes.find(r => r._id === selectedResume);
      
      // Chuẩn bị dữ liệu application với thông tin chi tiết
      const applicationData = {
        candidateId,
        jobId: job._id,
        resumeId: selectedResume,
        coverLetter,
        cvFromProfile: selectedResumeData?.fromProfile || false,
        cvUrl: selectedResumeData?.fileUrl || null,
        resumeTitle: selectedResumeData?.title || 'CV',
        resumeFileName: selectedResumeData?.fileName || 'CV.pdf',
        // Thêm thông tin job
        jobTitle: job.jobTitle,
        companyName: job.employerId?.companyName || job.companyName,
        // Thêm thông tin candidate từ profile
        candidateName: profileData?.fullName || '',
        candidateEmail: profileData?.email || '',
        candidatePhone: profileData?.phoneNumber || '',
        // Thêm thông tin application
        applicationDate: new Date().toISOString(),
        status: 'pending', // Trạng thái mặc định
        // Thêm metadata
        source: 'web_application',
        profileCompletion: profileCompletion
      };

      console.log('Submitting application data:', applicationData);

      const response = await fetch('https://be-khoa-luan2.vercel.app/api/application/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setCoverLetter('');
          setSelectedResume(null);
        }, 2000);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi nộp hồ sơ');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setError('Không thể kết nối đến máy chủ');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileType = (fileName) => {
    if (!fileName) return 'PDF';
    const extension = fileName.split('.').pop()?.toLowerCase();
    return extension === 'docx' ? 'DOCX' : 'PDF';
  };

  const getFileIcon = (fileName) => {
    const type = getFileType(fileName);
    return type === 'DOCX' ? '📄' : '📋';
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ paddingTop: '80px' }}>
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[calc(100vh-120px)] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Gửi CV cho vị trí này
            </h2>
            <p className="text-gray-600 mt-1">
              {job?.jobTitle} - {job?.employerId?.companyName || job?.companyName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCheck className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">
                Nộp hồ sơ thành công!
              </h3>
              <p className="text-gray-600 text-lg">
                Hồ sơ của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ sớm nhất!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* CV Selection Section */}
              <div className="bg-gray-50 rounded-md p-2">
                <h3 className="text-xs font-semibold text-gray-900 mb-1.5 flex items-center gap-1.5">
                  <FaFileAlt className="w-2.5 h-2.5 text-blue-600" />
                  Chọn CV của bạn
                </h3>
                

                
                {isLoading && (
                  <div className="text-center py-4">
                    <FaSpinner className="w-6 h-6 animate-spin text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Đang tải thông tin CV...</p>
                  </div>
                )}
                
                {!isLoading && resumes.length > 0 ? (
                  <>
                    {profileCompletion < 50 && (
                      <div className="mb-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">!</span>
                          </div>
                          <span className="text-orange-800 text-xs font-semibold">Hồ sơ chưa hoàn thiện</span>
                        </div>
                        <p className="text-orange-700 text-xs mb-2">
                          Hồ sơ hiện tại chỉ hoàn thành {profileCompletion}%. Cần hoàn thành ít nhất 50% để nộp đơn.
                        </p>
                        <div className="w-full bg-orange-200 rounded-full h-2 mb-1">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${profileCompletion}%` }}
                          ></div>
                        </div>
                        <p className="text-orange-600 text-xs">{profileCompletion}% hoàn thành</p>
                      </div>
                    )}
                    <div className="space-y-1 mb-2">
                      {resumes.map((resume) => (
                        <div
                          key={resume._id}
                          className={`flex items-center p-1.5 border rounded cursor-pointer transition-all ${
                            selectedResume === resume._id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedResume(resume._id)}
                        >
                          <div className="flex items-center gap-1.5 flex-1">
                            <div className="text-sm">{getFileIcon(resume.fileName)}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-xs">
                                {resume.title}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="bg-gray-200 px-0.5 py-0.5 rounded text-xs">
                                  {getFileType(resume.fileName)}
                                </span>
                                {resume.isPrimary && (
                                  <span className="bg-blue-100 text-blue-700 px-0.5 py-0.5 rounded text-xs">
                                    CV chính
                                  </span>
                                )}
                                {resume.fromProfile && (
                                  <span className="bg-green-100 text-green-700 px-0.5 py-0.5 rounded text-xs">
                                    CV hồ sơ
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {selectedResume === resume._id && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaCheck className="w-1.5 h-1.5 text-white" />
                              </div>
                            )}
                            {resume.fromProfile && resume.fileUrl && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const pdfUrl = resume.fileUrl;
                                  if (pdfUrl.startsWith('data:application/pdf')) {
                                    const byteCharacters = atob(pdfUrl.split(',')[1]);
                                    const byteNumbers = new Array(byteCharacters.length);
                                    for (let i = 0; i < byteCharacters.length; i++) {
                                      byteNumbers[i] = byteCharacters.charCodeAt(i);
                                    }
                                    const byteArray = new Uint8Array(byteNumbers);
                                    const blob = new Blob([byteArray], { type: 'application/pdf' });
                                    const blobUrl = URL.createObjectURL(blob);
                                    window.open(blobUrl, '_blank');
                                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                                  } else {
                                    window.open(pdfUrl, '_blank');
                                  }
                                }}
                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                title="Xem CV"
                              >
                                <FaEye className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : !isLoading && (
                  <div className="text-center py-4 mb-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FaFileAlt className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                      {profileCompletion < 50 ? 'Hồ sơ chưa hoàn thiện' : 'Bạn chưa có CV trong hồ sơ'}
                    </h4>
                    <p className="text-yellow-700 text-xs mb-3">
                      {profileCompletion < 50 
                        ? `Hồ sơ hiện tại chỉ hoàn thành ${profileCompletion}%. Cần hoàn thành ít nhất 50% để nộp đơn.`
                        : 'Vui lòng cập nhật CV trong hồ sơ cá nhân để tiếp tục nộp đơn'
                      }
                    </p>
                    {profileCompletion < 50 && (
                      <div className="mb-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${profileCompletion}%` }}
                          ></div>
                        </div>
                        <p className="text-yellow-600 text-xs mt-1">{profileCompletion}% hoàn thành</p>
                      </div>
                    )}
                    <button
                      onClick={() => {
                        onClose();
                        window.location.href = '/candidate/profile';
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white text-xs font-medium rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      <FaPlus className="w-3 h-3" />
                      {profileCompletion < 50 ? 'Hoàn thiện hồ sơ' : 'Cập nhật CV ngay'}
                    </button>
                  </div>
                )}
              </div>

              {/* Cover Letter Section */}
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tin nhắn gửi Doanh nghiệp
                </h3>
                
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-semibold text-blue-800 mb-2">
                    💡 Gợi ý cấu trúc tin nhắn:
                  </p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Mở đầu:</strong> Chào hỏi và giới thiệu bản thân ngắn gọn</li>
                    <li>• <strong>Quan tâm:</strong> Nêu rõ sự quan tâm đến vị trí này</li>
                    <li>• <strong>Kinh nghiệm:</strong> Điểm qua kinh nghiệm liên quan</li>
                    <li>• <strong>Kết thúc:</strong> Bày tỏ mong muốn được phỏng vấn</li>
                  </ul>
                </div>
                
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Viết tin nhắn gửi doanh nghiệp... (Không bắt buộc)"
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tin nhắn này sẽ được gửi kèm với CV của bạn
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || (!selectedResume && resumes.length > 0) || profileCompletion < 50}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                    isSubmitting || (!selectedResume && resumes.length > 0) || profileCompletion < 50
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner className="w-4 h-4 animate-spin" />
                      Đang gửi...
                    </div>
                  ) : (
                    'Gửi CV ngay'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal; 