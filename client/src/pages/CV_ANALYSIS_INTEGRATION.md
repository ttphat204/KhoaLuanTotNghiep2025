# Tích hợp API Phân tích CV

## Tổng quan

Trang `CVCheckPage.jsx` đã được tích hợp với API phân tích CV thông minh từ [GitHub repository](https://github.com/thiendao2308/api_analysis_CV) và endpoint `https://api-analyze-cv.onrender.com/`.

## Tính năng mới

### 1. **Intelligent CV Analysis**
- Phân tích CV thực tế thay vì mock data
- Sử dụng AI để đánh giá sự phù hợp với công việc
- Trích xuất thông tin từ file CV (PDF/DOCX/TXT)

### 2. **Advanced Matching System**
- **Intelligent JD Matching**: So sánh kỹ năng thông minh sử dụng LLM
- **Semantic Understanding**: Hiểu ý nghĩa thay vì chỉ so sánh từ khóa
- **Skills Analysis**: Phân tích kỹ năng phù hợp và thiếu

### 3. **Comprehensive Scoring**
- **ATS Score**: Đánh giá khả năng vượt qua hệ thống ATS
- **Overall Score**: Điểm tổng thể
- **Skills Match Score**: Độ phù hợp kỹ năng
- **Detailed Analysis**: Phân tích chi tiết từng tiêu chí

### 4. **Intelligent Feedback**
- **LLM-powered feedback**: Đánh giá thông minh từ AI
- **Personalized suggestions**: Gợi ý cải thiện cụ thể
- **Context-aware recommendations**: Dựa trên ngành nghề và vị trí

## Cách sử dụng

### 1. **Chuẩn bị dữ liệu**
```javascript
// CV file từ profile hoặc upload
const cvFile = userProfile.cvUrl;

// Thông tin công việc (nếu có)
const jobRequirements = {
  title: "Software Engineer",
  description: "Mô tả công việc...",
  requirements: "Yêu cầu ứng viên...",
  benefits: "Phúc lợi..."
};

// Chọn ngành nghề và vị trí
const selectedCategory = "INFORMATION-TECHNOLOGY";
const selectedPosition = "FULLSTACK_DEVELOPER";
```

### 2. **Gọi API phân tích**
```javascript
const analyzeCV = async () => {
  const formData = new FormData();
  formData.append('cv_file', cvFile);
  formData.append('job_category', selectedCategory);
  formData.append('job_position', selectedPosition);
  formData.append('jd_text', jdText);

  const response = await fetch('https://api-analyze-cv.onrender.com/analyze-cv', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  // Xử lý kết quả...
};
```

### 3. **Hiển thị kết quả**
```javascript
// Kết quả từ API
const evaluation = {
  overallScore: result.scores.overall_score,
  matchScore: result.matching_analysis.skills_match_score,
  atsScore: result.scores.ats_score,
  matchingSkills: result.matching_analysis.matching_skills,
  missingSkills: result.matching_analysis.missing_skills,
  intelligentFeedback: result.feedback,
  // ...
};
```

## API Response Structure

### **Success Response:**
```json
{
  "cv_analysis": {
    "experience_score": 85,
    "education_score": 90,
    "certifications_score": 75,
    "experience_comment": "Kinh nghiệm phù hợp...",
    "education_comment": "Trình độ học vấn tốt...",
    "certifications_comment": "Cần bổ sung chứng chỉ..."
  },
  "jd_analysis": {
    "extracted_skills": ["Python", "React", "Docker"],
    "required_experience": "3+ years",
    "education_requirements": "Bachelor's degree"
  },
  "matching_analysis": {
    "matching_skills": ["Python", "React"],
    "missing_skills": ["Docker", "AWS"],
    "skills_match_score": 85.5,
    "exact_matches": ["Python"],
    "semantic_matches": ["React", "JavaScript"]
  },
  "quality_analysis": {
    "structure_score": 80,
    "content_score": 85,
    "formatting_score": 90
  },
  "scores": {
    "ats_score": 75,
    "overall_score": 82
  },
  "feedback": "CV của bạn khá phù hợp với vị trí...",
  "suggestions": [
    "Nên học Docker để triển khai ứng dụng",
    "Bổ sung kinh nghiệm với AWS"
  ],
  "job_category": "INFORMATION-TECHNOLOGY",
  "job_position": "FULLSTACK_DEVELOPER"
}
```

### **Error Response:**
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Xử lý lỗi

### **Common Errors:**
1. **File not found**: CV file không tồn tại hoặc không thể truy cập
2. **Invalid file format**: File không phải PDF/DOCX/TXT
3. **API timeout**: API mất quá nhiều thời gian xử lý
4. **Network error**: Lỗi kết nối mạng

### **Error Handling:**
```javascript
try {
  const response = await fetch('https://api-analyze-cv.onrender.com/analyze-cv', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  // Process result...
} catch (error) {
  console.error('Error analyzing CV:', error);
  setAnalysisError(error.message);
}
```

## Performance Considerations

### **API Performance:**
- **First Request**: 10-15s (model loading)
- **Subsequent Requests**: 3-5s
- **LLM Calls**: 2-3s per call

### **Memory Usage:**
- **Local**: ~200-400MB
- **Render Free Tier**: ~450MB (optimized)

### **Optimization Tips:**
1. **Lazy Loading**: Chỉ gọi API khi cần thiết
2. **Caching**: Cache kết quả phân tích
3. **Error Retry**: Tự động thử lại khi lỗi
4. **Loading States**: Hiển thị trạng thái loading rõ ràng

## Security

### **API Security:**
- **HTTPS**: Tự động với Render
- **CORS**: Cấu hình cho production
- **Environment Variables**: Sử dụng cho API keys

### **Data Privacy:**
- **File Upload**: Chỉ gửi file CV cần thiết
- **No Storage**: Không lưu trữ dữ liệu nhạy cảm
- **Temporary Processing**: Xử lý tạm thời

## Troubleshooting

### **Debug Mode:**
```javascript
// Hiển thị debug info trong development
{process.env.NODE_ENV === 'development' && evaluation.apiResult && (
  <div className="bg-white rounded-lg shadow-sm border p-6">
    <h2>Debug Info (API Response)</h2>
    <details>
      <summary>Xem chi tiết API response</summary>
      <pre>{JSON.stringify(evaluation.apiResult, null, 2)}</pre>
    </details>
  </div>
)}
```

### **Common Issues:**
1. **CORS Error**: Kiểm tra domain được phép
2. **File Size**: Đảm bảo file CV < 10MB
3. **API Timeout**: Tăng timeout cho request lớn
4. **Memory Issues**: Kiểm tra memory usage

## Future Enhancements

### **Planned Features:**
1. **Multi-language Support**: Hỗ trợ nhiều ngôn ngữ
2. **Advanced Analytics**: Thống kê chi tiết hơn
3. **Real-time Collaboration**: Chia sẻ kết quả
4. **Custom Scoring**: Tùy chỉnh tiêu chí đánh giá

### **Integration Opportunities:**
1. **Job Matching**: Tự động gợi ý việc làm phù hợp
2. **CV Builder**: Tích hợp tạo CV thông minh
3. **Interview Prep**: Chuẩn bị phỏng vấn dựa trên phân tích
4. **Career Path**: Đề xuất lộ trình phát triển sự nghiệp 