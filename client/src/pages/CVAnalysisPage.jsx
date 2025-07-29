import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CVAnalysisPage = () => {
  const { user } = useAuth();
  const [cvFile, setCvFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCvFile(file);
    } else {
      alert('Vui lòng chọn file PDF');
    }
  };

  const handleAnalyze = async () => {
    if (!cvFile) {
      alert('Vui lòng chọn file CV để phân tích');
      return;
    }

    setLoading(true);
    // TODO: Implement CV analysis logic here
    // This would typically involve uploading the file to the server
    // and getting analysis results back
    
    setTimeout(() => {
      setAnalysis({
        score: 85,
        strengths: ['Kinh nghiệm làm việc tốt', 'Kỹ năng kỹ thuật mạnh', 'Trình độ học vấn phù hợp'],
        weaknesses: ['Thiếu kinh nghiệm quản lý', 'Cần cải thiện kỹ năng giao tiếp'],
        suggestions: ['Bổ sung thêm các chứng chỉ liên quan', 'Tham gia các khóa học kỹ năng mềm']
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Phân Tích CV
          </h1>
          
          <div className="mb-8">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="cv-upload"
              />
              <label
                htmlFor="cv-upload"
                className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Chọn File CV (PDF)
              </label>
              {cvFile && (
                <p className="mt-2 text-sm text-gray-600">
                  Đã chọn: {cvFile.name}
                </p>
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <button
              onClick={handleAnalyze}
              disabled={!cvFile || loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang phân tích...' : 'Phân Tích CV'}
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Đang phân tích CV của bạn...</p>
            </div>
          )}

          {analysis && (
            <div className="mt-8 space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Điểm số CV: {analysis.score}/100
                </h3>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${analysis.score}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Điểm mạnh
                  </h3>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-blue-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    Điểm cần cải thiện
                  </h3>
                  <ul className="space-y-2">
                    {analysis.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠</span>
                        <span className="text-red-700">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                  Gợi ý cải thiện
                </h3>
                <ul className="space-y-2">
                  {analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">💡</span>
                      <span className="text-yellow-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CVAnalysisPage; 