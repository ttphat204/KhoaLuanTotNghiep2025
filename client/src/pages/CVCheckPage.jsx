import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUser, FaFileAlt, FaStar, FaCheckCircle, FaExclamationTriangle, FaLightbulb, FaEye, FaTimes, FaHeart } from 'react-icons/fa';

// Danh sách categories và positions
const jobCategories = [
  { value: "INFORMATION-TECHNOLOGY", label: "Công nghệ thông tin" },
  { value: "ENGINEERING", label: "Kỹ thuật" },
  { value: "FINANCE", label: "Tài chính" },
  { value: "SALES", label: "Kinh doanh/Bán hàng" },
  { value: "HR", label: "Nhân sự" },
  { value: "MARKETING", label: "Marketing" },
  { value: "HEALTHCARE", label: "Y tế" },
  { value: "EDUCATION", label: "Giáo dục" },
  { value: "CONSULTANT", label: "Tư vấn" },
  { value: "DESIGNER", label: "Thiết kế" },
  { value: "ACCOUNTANT", label: "Kế toán" },
  { value: "LAWYER", label: "Luật sư" },
  { value: "OTHER", label: "Khác" },
];

// Mapping vị trí cụ thể theo ngành nghề
const jobPositions = {
  "INFORMATION-TECHNOLOGY": [
    { value: "FRONTEND_DEVELOPER", label: "Lập trình viên Front-end" },
    { value: "BACKEND_DEVELOPER", label: "Lập trình viên Back-end" },
    { value: "FULLSTACK_DEVELOPER", label: "Lập trình viên Full-stack" },
    { value: "MOBILE_DEVELOPER", label: "Lập trình viên Mobile" },
    { value: "DATA_SCIENTIST", label: "Nhà khoa học dữ liệu" },
    { value: "DEVOPS_ENGINEER", label: "Kỹ sư DevOps" },
    { value: "QA_ENGINEER", label: "Kỹ sư QA/Testing" },
    { value: "UI_UX_DESIGNER", label: "Thiết kế UI/UX" },
    { value: "SYSTEM_ADMIN", label: "Quản trị hệ thống" },
    { value: "CYBERSECURITY", label: "Bảo mật thông tin" },
  ],
  ENGINEERING: [
    { value: "SOFTWARE_ENGINEER", label: "Kỹ sư phần mềm" },
    { value: "MECHANICAL_ENGINEER", label: "Kỹ sư cơ khí" },
    { value: "ELECTRICAL_ENGINEER", label: "Kỹ sư điện" },
    { value: "CIVIL_ENGINEER", label: "Kỹ sư xây dựng" },
    { value: "CHEMICAL_ENGINEER", label: "Kỹ sư hóa học" },
    { value: "INDUSTRIAL_ENGINEER", label: "Kỹ sư công nghiệp" },
  ],
  FINANCE: [
    { value: "FINANCIAL_ANALYST", label: "Chuyên viên phân tích tài chính" },
    { value: "ACCOUNTANT", label: "Kế toán viên" },
    { value: "AUDITOR", label: "Kiểm toán viên" },
    { value: "INVESTMENT_BANKER", label: "Chuyên viên đầu tư" },
    { value: "FINANCIAL_ADVISOR", label: "Cố vấn tài chính" },
    { value: "RISK_MANAGER", label: "Quản lý rủi ro" },
  ],
  SALES: [
    { value: "SALES_REPRESENTATIVE", label: "Đại diện bán hàng" },
    { value: "SALES_MANAGER", label: "Quản lý bán hàng" },
    { value: "BUSINESS_DEVELOPMENT", label: "Phát triển kinh doanh" },
    { value: "ACCOUNT_MANAGER", label: "Quản lý khách hàng" },
    { value: "SALES_DIRECTOR", label: "Giám đốc bán hàng" },
  ],
  HR: [
    { value: "HR_SPECIALIST", label: "Chuyên viên nhân sự" },
    { value: "HR_MANAGER", label: "Quản lý nhân sự" },
    { value: "RECRUITER", label: "Tuyển dụng" },
    { value: "COMPENSATION_SPECIALIST", label: "Chuyên viên lương thưởng" },
    { value: "TRAINING_SPECIALIST", label: "Chuyên viên đào tạo" },
  ],
  MARKETING: [
    { value: "DIGITAL_MARKETING", label: "Marketing kỹ thuật số" },
    { value: "SEO_SPECIALIST", label: "Chuyên viên SEO" },
    { value: "CONTENT_MARKETING", label: "Marketing nội dung" },
    { value: "SOCIAL_MEDIA_MANAGER", label: "Quản lý mạng xã hội" },
    { value: "MARKETING_MANAGER", label: "Quản lý marketing" },
    { value: "BRAND_MANAGER", label: "Quản lý thương hiệu" },
    { value: "MARKETING_ANALYST", label: "Phân tích marketing" },
  ],
  HEALTHCARE: [
    { value: "DOCTOR", label: "Bác sĩ" },
    { value: "NURSE", label: "Y tá" },
    { value: "PHARMACIST", label: "Dược sĩ" },
    { value: "MEDICAL_TECHNOLOGIST", label: "Kỹ thuật viên y tế" },
    { value: "HEALTHCARE_ADMIN", label: "Quản lý y tế" },
  ],
  EDUCATION: [
    { value: "TEACHER", label: "Giáo viên" },
    { value: "PROFESSOR", label: "Giảng viên" },
    { value: "EDUCATION_ADMIN", label: "Quản lý giáo dục" },
    { value: "CURRICULUM_SPECIALIST", label: "Chuyên viên chương trình" },
  ],
  CONSULTANT: [
    { value: "MANAGEMENT_CONSULTANT", label: "Tư vấn quản lý" },
    { value: "IT_CONSULTANT", label: "Tư vấn CNTT" },
    { value: "FINANCIAL_CONSULTANT", label: "Tư vấn tài chính" },
    { value: "STRATEGY_CONSULTANT", label: "Tư vấn chiến lược" },
  ],
  DESIGNER: [
    { value: "GRAPHIC_DESIGNER", label: "Thiết kế đồ họa" },
    { value: "UI_UX_DESIGNER", label: "Thiết kế UI/UX" },
    { value: "WEB_DESIGNER", label: "Thiết kế web" },
    { value: "PRODUCT_DESIGNER", label: "Thiết kế sản phẩm" },
    { value: "INTERIOR_DESIGNER", label: "Thiết kế nội thất" },
  ],
  ACCOUNTANT: [
    { value: "ACCOUNTANT", label: "Kế toán viên" },
    { value: "SENIOR_ACCOUNTANT", label: "Kế toán trưởng" },
    { value: "AUDITOR", label: "Kiểm toán viên" },
    { value: "TAX_SPECIALIST", label: "Chuyên viên thuế" },
  ],
  LAWYER: [
    { value: "LAWYER", label: "Luật sư" },
    { value: "LEGAL_ADVISOR", label: "Cố vấn pháp lý" },
    { value: "PARALEGAL", label: "Trợ lý luật sư" },
    { value: "COMPLIANCE_SPECIALIST", label: "Chuyên viên tuân thủ" },
  ],
  OTHER: [{ value: "GENERAL", label: "Vị trí khác" }],
};

// Lấy danh sách vị trí theo ngành nghề đã chọn
const getPositionsForCategory = (category) => {
  return jobPositions[category] || [];
};

// Lấy label của category theo value
const getCategoryLabel = (value) => {
  const category = jobCategories.find(cat => cat.value === value);
  return category ? category.label : value;
};

// Lấy label của position theo value và category
const getPositionLabel = (positionValue, categoryValue) => {
  const positions = getPositionsForCategory(categoryValue);
  const position = positions.find(pos => pos.value === positionValue);
  return position ? position.label : positionValue;
};

const CVCheckPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const jobData = location.state?.jobData;

  const [cvFile, setCvFile] = useState(null);
  const [jobRequirements, setJobRequirements] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [analysisError, setAnalysisError] = useState(null);
  const [uploadedCV, setUploadedCV] = useState(null);

  // Utility function để xử lý HTML entities
  const decodeHtmlEntities = (text) => {
    if (!text) return '';
    
    // Nếu là array, xử lý từng phần tử
    if (Array.isArray(text)) {
      return text.map(item => decodeHtmlEntities(item)).join('<br>');
    }
    
    // Chuyển đổi thành string nếu không phải string
    const textString = String(text);
    
    return textString
      .replace(/&nbsp;/g, ' ') // Thay thế &nbsp; bằng space
      .replace(/&amp;/g, '&') // Thay thế &amp; bằng &
      .replace(/&lt;/g, '<') // Thay thế &lt; bằng <
      .replace(/&gt;/g, '>') // Thay thế &gt; bằng >
      .replace(/&quot;/g, '"') // Thay thế &quot; bằng "
      .replace(/&#39;/g, "'") // Thay thế &#39; bằng '
      .replace(/&apos;/g, "'"); // Thay thế &apos; bằng '
  };



  // Fetch thông tin profile đầy đủ của user
  useEffect(() => {
    const fetchUserProfile = async () => {
      console.log('User object:', user); // Debug log
      console.log('User ID fields:', {
        _id: user?._id,
        id: user?.id,
        userId: user?.userId
      }); // Debug log
      
      // Tìm userId từ các field có thể có
      const userId = user?._id || user?.id || user?.userId;
      console.log('Selected userId:', userId); // Debug log
      
      if (user && userId) {
        setLoadingProfile(true);
        setProfileError(null);
        try {
          // Sử dụng userId thay vì candidateId như trong ApplicationModal
          const apiUrl = `https://be-khoaluan.vercel.app/api/candidate/profile?userId=${userId}`;
          console.log('API URL:', apiUrl); // Debug log
          
          const response = await fetch(apiUrl);
          console.log('Response status:', response.status); // Debug log
          
          const data = await response.json();
          console.log('API Response:', data); // Debug log
          
          if (data.success) {
            setUserProfile(data.data);
            console.log('Full user profile:', data.data); // Debug log
            
            // Tìm CV URL từ profile
            const cvUrl = data.data.cvUrl || data.data.cv || data.data.resumeUrl || 
                         data.data.resume || data.data.cvFile || data.data.cvFileUrl;
            console.log('CV URL found:', cvUrl); // Debug log
            
            if (cvUrl) {
              // Kiểm tra xem URL có hợp lệ không
              if (cvUrl.startsWith('http') || cvUrl.startsWith('data:')) {
              setCvFile(cvUrl);
              } else {
                console.warn('Invalid CV URL format:', cvUrl);
                setCvFile(null);
              }
            } else {
              console.log('No CV URL found in profile');
              setCvFile(null);
            }
          } else {
            console.log('API Error:', data.message); // Debug log
            setProfileError('Không thể tải thông tin profile');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setProfileError('Lỗi khi tải thông tin profile');
        } finally {
          setLoadingProfile(false);
        }
      } else {
        console.log('No user or userId found'); // Debug log
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Load job requirements nếu có
  useEffect(() => {
    if (jobData) {
      console.log('JobData received:', jobData); // Debug log
      console.log('JobRequirements data received in CVCheckPage:', jobData.jobRequirements); // Debug log
      console.log('Is jobRequirements data empty?', !jobData.jobRequirements); // Debug log
      console.log('Length of jobRequirements data:', jobData.jobRequirements?.length || 0); // Debug log
      
      setJobRequirements({
        title: jobData.title || '',
        description: jobData.description || '',
        requirements: jobData.jobRequirements || '',
        benefits: jobData.benefits || '',
        salary: jobData.salary || ''
      });
    }
  }, [jobData]);

  const analyzeCV = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    
    try {
    // Lấy thông tin category và position đã chọn
    const selectedCategoryLabel = getCategoryLabel(selectedCategory);
    const selectedPositionLabel = getPositionLabel(selectedPosition, selectedCategory);
    
    console.log('Analyzing CV for:', {
      category: selectedCategoryLabel,
      position: selectedPositionLabel,
        hasJobRequirements: !!jobRequirements,
        cvFile: cvFile
    });
    
      // Kiểm tra xem có CV file và thông tin cần thiết không
      const cvFileToUse = uploadedCV || cvFile;
      if (!cvFileToUse) {
        throw new Error('Không có file CV để phân tích. Vui lòng upload CV hoặc cập nhật profile.');
      }

      if (!selectedCategory || !selectedPosition) {
        throw new Error('Vui lòng chọn ngành nghề và vị trí công việc');
      }

      // Chuẩn bị dữ liệu cho API
      const formData = new FormData();
      
      console.log('CV File type:', typeof cvFileToUse, cvFileToUse);
      
      // Xử lý các loại CV file khác nhau
      if (cvFileToUse.startsWith('http') || cvFileToUse.startsWith('data:')) {
        // Nếu cvFile là URL hoặc data URL
        try {
          const response = await fetch(cvFile);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          console.log('Downloaded blob:', blob);
          
          // Tạo file object từ blob
          const file = new File([blob], 'cv.pdf', { type: blob.type || 'application/pdf' });
          console.log('Created file object:', file);
          formData.append('cv_file', file);
        } catch (error) {
          console.error('Error downloading CV file:', error);
          throw new Error('Không thể tải file CV từ URL');
        }
              } else if (cvFileToUse instanceof File) {
          // Nếu cvFile là File object
          console.log('Using existing File object:', cvFileToUse);
          formData.append('cv_file', cvFileToUse);
        } else if (typeof cvFileToUse === 'string') {
        // Nếu cvFile là string (có thể là base64 hoặc path)
        console.log('CV File is string, attempting to convert...');
        
        // Thử tạo file từ string (có thể là base64)
        try {
          let blob;
          if (cvFile.startsWith('data:')) {
            // Data URL
            const response = await fetch(cvFile);
            blob = await response.blob();
          } else {
            // Có thể là base64 string
            const base64Response = await fetch(`data:application/pdf;base64,${cvFile}`);
            blob = await base64Response.blob();
          }
          
          const file = new File([blob], 'cv.pdf', { type: 'application/pdf' });
          formData.append('cv_file', file);
        } catch (error) {
          console.error('Error converting string to file:', error);
          throw new Error('Không thể chuyển đổi CV file từ string');
        }
              } else {
          console.error('Unsupported CV file format:', cvFileToUse);
          throw new Error(`Định dạng CV file không được hỗ trợ: ${typeof cvFileToUse}`);
        }

      // Thêm các thông tin khác
      formData.append('job_category', selectedCategory);
      formData.append('job_position', selectedPosition);
      
      // Thêm JD text nếu có - Clean HTML tags
      let jdText = '';
      if (jobRequirements) {
        // Debug jobRequirements structure
        console.log('🔍 JobRequirements structure:', jobRequirements);
        console.log('🔍 JobRequirements type:', typeof jobRequirements);
        
        // Handle different types of jobRequirements
        let requirementsObj = jobRequirements;
        
        if (Array.isArray(jobRequirements)) {
          console.log('⚠️ JobRequirements is an array, using first item');
          requirementsObj = jobRequirements[0] || {};
        } else if (typeof jobRequirements === 'string') {
          console.log('⚠️ JobRequirements is a string, creating object');
          requirementsObj = { description: jobRequirements };
        }
        
        console.log('🔍 Final requirements object:', requirementsObj);
        console.log('🔍 Requirements keys:', Object.keys(requirementsObj));
        
        // Clean HTML tags từ job requirements - với validation
        const cleanText = (text) => {
          console.log('🔍 Cleaning text:', text, 'Type:', typeof text);
          if (!text || typeof text !== 'string') {
            console.log('❌ Text is not valid string, returning empty');
            return '';
          }
          const cleaned = text.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
          console.log('✅ Cleaned text:', cleaned);
          return cleaned;
        };
        
        const cleanTitle = cleanText(requirementsObj.title);
        const cleanDescription = cleanText(requirementsObj.description);
        const cleanRequirements = cleanText(requirementsObj.requirements);
        const cleanBenefits = cleanText(requirementsObj.benefits);
        
        jdText = `Tiêu đề: ${cleanTitle}\n` +
                `Mô tả: ${cleanDescription}\n` +
                `Yêu cầu: ${cleanRequirements}\n` +
                `Phúc lợi: ${cleanBenefits}`;
      } else {
        console.log('⚠️ No jobRequirements found, using fallback text');
        jdText = `Vị trí: ${selectedPositionLabel}\nNgành nghề: ${selectedCategoryLabel}`;
      }
      
      console.log('Cleaned JD Text:', jdText);
      formData.append('jd_text', jdText);

      console.log('Sending request to CV Analysis API...');
      console.log('FormData contents:', {
        cv_file: formData.get('cv_file'),
        job_category: formData.get('job_category'),
        job_position: formData.get('job_position'),
        jd_text: formData.get('jd_text')
      });
      
      // Gọi API phân tích CV
      const response = await fetch('https://api-analyze-cv.onrender.com/analyze-cv', {
        method: 'POST',
        body: formData,
        // Thêm timeout để tránh request bị treo
        signal: AbortSignal.timeout(60000) // 60 seconds timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Nếu API không hoạt động, sử dụng fallback
        if (response.status === 422 || response.status >= 500) {
          console.warn('API không khả dụng, sử dụng fallback analysis...');
          return await performFallbackAnalysis(selectedCategoryLabel, selectedPositionLabel);
        }
        
        throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('CV Analysis API Response:', result);
      
      // Debug skills before and after cleaning
      const rawMatchingSkills = result.matching_analysis?.matching_skills || [];
      const rawMissingSkills = result.matching_analysis?.missing_skills || [];
      
      console.log('🔍 Raw skills from API:');
      console.log('Raw matching skills:', rawMatchingSkills);
      console.log('Raw missing skills:', rawMissingSkills);
      
      const cleanedMatchingSkills = cleanAndFilterSkills(rawMatchingSkills);
      const cleanedMissingSkills = cleanAndFilterSkills(rawMissingSkills);
      
      console.log('✅ Cleaned skills:');
      console.log('Cleaned matching skills:', cleanedMatchingSkills);
      console.log('Cleaned missing skills:', cleanedMissingSkills);
      
      // Log filtered out skills
      const filteredOutMatching = rawMatchingSkills.filter(skill => !cleanedMatchingSkills.includes(skill));
      const filteredOutMissing = rawMissingSkills.filter(skill => !cleanedMissingSkills.includes(skill));
      
      if (filteredOutMatching.length > 0) {
        console.log('Filtered out matching skills:', filteredOutMatching);
      }
      if (filteredOutMissing.length > 0) {
        console.log('Filtered out missing skills:', filteredOutMissing);
      }

      // Force clean skills nếu vẫn còn HTML tags
      const forceCleanSkills = (skills) => {
        return skills.map(skill => {
          if (typeof skill !== 'string') return '';
          
          // Force remove all HTML tags and entities
          let cleaned = skill
            .replace(/<[^>]*>/g, '') // Remove all HTML tags
            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
            .replace(/&amp;/g, '&') // Replace &amp; with &
            .replace(/&lt;/g, '<') // Replace &lt; with <
            .replace(/&gt;/g, '>') // Replace &gt; with >
            .replace(/&quot;/g, '"') // Replace &quot; with "
            .replace(/&#39;/g, "'") // Replace &#39; with '
            .replace(/&apos;/g, "'") // Replace &apos; with '
            .trim();
          
          // Remove trailing period
          cleaned = cleaned.replace(/\.$/, '');
          
          return cleaned;
        }).filter(skill => skill.length > 0 && skill.length <= 50);
      };

      // Apply force clean if needed
      const finalMatchingSkills = cleanedMatchingSkills.length > 0 ? cleanedMatchingSkills : forceCleanSkills(rawMatchingSkills);
      const finalMissingSkills = cleanedMissingSkills.length > 0 ? cleanedMissingSkills : forceCleanSkills(rawMissingSkills);
      
      console.log('🔧 Final skills after force clean:');
      console.log('Final matching skills:', finalMatchingSkills);
      console.log('Final missing skills:', finalMissingSkills);

      // Chuyển đổi kết quả từ API sang format hiển thị
      const evaluation = {
        overallScore: result.scores?.overall_score || 0,
        matchScore: result.matching_analysis?.skills_match_score || 0,
        targetPosition: {
          category: selectedCategoryLabel,
          position: selectedPositionLabel
        },
        strengths: result.feedback?.strengths || result.feedback?.overall_assessment ? [
          'Kỹ năng phù hợp với yêu cầu công việc',
          'Trình độ học vấn đáp ứng tiêu chuẩn'
        ] : [],
        weaknesses: result.feedback?.weaknesses || result.feedback?.overall_assessment ? [
          'Cần cải thiện một số kỹ năng chuyên môn',
          'Thiếu kinh nghiệm trong một số lĩnh vực'
        ] : [],
        suggestions: result.feedback?.specific_suggestions || result.feedback?.priority_actions || result.suggestions || [
          'Bổ sung thêm các chứng chỉ chuyên môn',
          'Tham gia các khóa học kỹ năng mềm',
          'Tích lũy thêm kinh nghiệm thực tế'
        ],
        detailedAnalysis: {
          experience: { 
            score: result.cv_analysis?.experience_score || 75, 
            comment: result.cv_analysis?.experience_comment || 'Kinh nghiệm phù hợp với vị trí' 
          },
          education: { 
            score: result.cv_analysis?.education_score || 80, 
            comment: result.cv_analysis?.education_comment || 'Trình độ học vấn tốt' 
          },
          skills: { 
            score: result.matching_analysis?.skills_match_score || 70, 
            comment: `Phù hợp ${result.matching_analysis?.skills_match_score || 70}% với yêu cầu kỹ năng` 
          },
          certifications: { 
            score: result.cv_analysis?.certifications_score || 65, 
            comment: result.cv_analysis?.certifications_comment || 'Cần bổ sung thêm chứng chỉ' 
          }
        },
        // Thêm thông tin chi tiết từ API
        apiResult: result,
        matchingSkills: finalMatchingSkills,
        missingSkills: finalMissingSkills,
        atsScore: result.scores?.ats_score || 0,
        qualityAnalysis: result.quality_analysis || {},
        intelligentFeedback: result.feedback?.overall_assessment || result.feedback || '',
        encouragement: result.feedback?.encouragement || '',
        priorityActions: result.feedback?.priority_actions || []
      };
      
      setEvaluation(evaluation);
      
    } catch (error) {
      console.error('Error analyzing CV:', error);
      
      // Xử lý các loại lỗi cụ thể
      let errorMessage = error.message;
      
      if (error.name === 'AbortError') {
        errorMessage = 'Request timeout - API mất quá nhiều thời gian phản hồi';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Không thể kết nối đến API - Vui lòng kiểm tra kết nối internet';
      } else if (error.message.includes('CORS')) {
        errorMessage = 'Lỗi CORS - API không cho phép truy cập từ domain này';
      }
      
      setAnalysisError(errorMessage);
      
      // Hiển thị thông báo lỗi cho user
      alert(`Lỗi khi phân tích CV: ${errorMessage}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  // Function để clean và filter skills
  const cleanAndFilterSkills = (skills) => {
    console.log('🔍 Starting cleanAndFilterSkills with:', skills);
    
    if (!Array.isArray(skills)) {
      console.log('❌ Input is not an array, returning empty array');
      return [];
    }
    
    const filteredSkills = skills.filter(skill => {
      console.log('🔍 Checking skill:', skill);
      
      // Loại bỏ skills quá dài hoặc chứa HTML
      if (typeof skill !== 'string') {
        console.log('❌ Not a string, filtering out');
        return false;
      }
      
      if (skill.length > 50) {
        console.log('❌ Too long (>50 chars), filtering out');
        return false;
      }
      
      if (skill.includes('<') || skill.includes('>')) {
        console.log('❌ Contains HTML tags, filtering out');
        return false;
      }
      
      if (skill.includes('&nbsp;') || skill.includes('&amp;')) {
        console.log('❌ Contains HTML entities, filtering out');
        return false;
      }
      
      // Loại bỏ một số từ không phù hợp
      const invalidWords = ['sinh nhật', 'tiêu đề', 'mô tả', 'yêu cầu', 'phúc lợi', 'hợp với bộ phận'];
      const lowerSkill = skill.toLowerCase();
      if (invalidWords.some(word => lowerSkill.includes(word))) {
        console.log('❌ Contains invalid word, filtering out');
        return false;
      }
      
      // Loại bỏ skills chứa dấu chấm câu không phù hợp
      if (skill.includes('</p>') || skill.includes('<p>')) {
        console.log('❌ Contains p tags, filtering out');
        return false;
      }
      
      if (skill.includes('&nbsp;&nbsp;&nbsp;')) {
        console.log('❌ Contains multiple nbsp, filtering out');
        return false;
      }
      
      console.log('✅ Skill passed all filters');
      return true;
    });
    
    console.log('🔍 After filtering:', filteredSkills);
    
    const cleanedSkills = filteredSkills.map(skill => {
      console.log('🧹 Cleaning skill:', skill);
      
      // Clean HTML entities và tags
      let cleanedSkill = skill
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/&amp;/g, '&') // Replace &amp; with &
        .replace(/&lt;/g, '<') // Replace &lt; with <
        .replace(/&gt;/g, '>') // Replace &gt; with >
        .replace(/&quot;/g, '"') // Replace &quot; with "
        .replace(/&#39;/g, "'") // Replace &#39; with '
        .replace(/&apos;/g, "'") // Replace &apos; with '
        .trim();
      
      // Loại bỏ dấu chấm thừa ở cuối
      cleanedSkill = cleanedSkill.replace(/\.$/, '');
      
      console.log('🧹 Cleaned skill:', cleanedSkill);
      return cleanedSkill;
    });
    
    const finalSkills = cleanedSkills.filter(skill => skill.length > 0 && skill.length <= 50);
    console.log('✅ Final cleaned skills:', finalSkills);
    
    return finalSkills;
  };

  // Fallback analysis khi API không hoạt động
  const performFallbackAnalysis = async (categoryLabel, positionLabel) => {
    console.log('Performing fallback analysis...');
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const fallbackEvaluation = {
      overallScore: 75,
      matchScore: 70,
      targetPosition: {
        category: categoryLabel,
        position: positionLabel
      },
      strengths: [
        'CV có cấu trúc rõ ràng và chuyên nghiệp',
        'Kinh nghiệm làm việc phù hợp với yêu cầu',
        'Trình độ học vấn đáp ứng tiêu chuẩn'
      ],
      weaknesses: [
        'Cần cải thiện một số kỹ năng chuyên môn',
        'Thiếu kinh nghiệm trong một số lĩnh vực cụ thể',
        'Cần bổ sung thêm chứng chỉ liên quan'
      ],
      suggestions: [
        'Bổ sung thêm các chứng chỉ chuyên môn',
        'Tham gia các khóa học kỹ năng mềm',
        'Tích lũy thêm kinh nghiệm thực tế',
        'Cải thiện khả năng ngoại ngữ'
      ],
      detailedAnalysis: {
        experience: { score: 75, comment: 'Kinh nghiệm phù hợp với vị trí' },
        education: { score: 80, comment: 'Trình độ học vấn tốt' },
        skills: { score: 70, comment: 'Kỹ năng cơ bản đáp ứng yêu cầu' },
        certifications: { score: 65, comment: 'Cần bổ sung thêm chứng chỉ' }
      },
      // Fallback specific fields
      atsScore: 70,
      matchingSkills: ['Kỹ năng cơ bản', 'Kinh nghiệm làm việc'],
      missingSkills: ['Kỹ năng chuyên môn nâng cao'],
      intelligentFeedback: 'CV của bạn có tiềm năng tốt cho vị trí này. Tuy nhiên, cần cải thiện thêm một số kỹ năng chuyên môn để tăng cơ hội thành công.',
      isFallback: true
    };
    
    setEvaluation(fallbackEvaluation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <FaArrowLeft className="w-4 h-4" />
                <span>Quay lại</span>
              </button>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Kiểm Tra CV</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - CV File Display */}
          <div className="space-y-6">
            {loadingProfile ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang tải thông tin CV...</h3>
                  <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
                </div>
              </div>
            ) : profileError ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-8">
                  <FaFileAlt className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải thông tin</h3>
                  <p className="text-gray-600 mb-4">{profileError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : cvFile ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileAlt className="w-5 h-5 text-indigo-600" />
                  Chọn CV của bạn
                </h2>
                
                <div className="border-2 border-blue-200 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaFileAlt className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">CV từ hồ sơ</h3>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                            PDF
                          </span>
                          <span className="px-2 py-1 bg-blue-200 text-blue-700 text-xs font-medium rounded">
                            CV chính
                          </span>
                          <span className="px-2 py-1 bg-green-200 text-green-700 text-xs font-medium rounded">
                            CV hồ sơ
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                        <FaCheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <button
                        onClick={() => setShowCVModal(true)}
                        className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center hover:bg-blue-200 transition-colors"
                        title="Xem CV"
                      >
                        <FaEye className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-8">
                  <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có file CV</h3>
                  <p className="text-gray-600 mb-4">Vui lòng tải lên CV hoặc cập nhật profile</p>
                  
                  {/* Upload CV File */}
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            console.log('Uploaded file:', file);
                            setUploadedCV(file);
                          }
                        }}
                        className="hidden"
                        id="cv-upload"
                      />
                      <label
                        htmlFor="cv-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <FaFileAlt className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click để chọn file CV (PDF, DOC, DOCX, TXT)
                        </span>
                      </label>
                    </div>
                    
                    {uploadedCV && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-800">
                            Đã chọn: {uploadedCV.name}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/candidate/profile')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <FaUser className="w-4 h-4" />
                    Cập nhật Profile
                  </button>
                      
                      {uploadedCV && (
                        <button
                          onClick={() => setUploadedCV(null)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <FaTimes className="w-4 h-4" />
                          Xóa file
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFileAlt className="w-5 h-5 text-blue-600" />
                Chọn Ngành Nghề
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngành nghề
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setSelectedPosition(''); // Reset position when category changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Chọn ngành nghề</option>
                    {jobCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vị trí công việc
                    </label>
                    <select
                      value={selectedPosition}
                      onChange={(e) => setSelectedPosition(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Chọn vị trí</option>
                      {getPositionsForCategory(selectedCategory).map((position) => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedCategory && selectedPosition && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                    <div className="text-sm text-blue-800">
                      <strong>Đã chọn:</strong> {getCategoryLabel(selectedCategory)} - {getPositionLabel(selectedPosition, selectedCategory)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {jobRequirements ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileAlt className="w-5 h-5 text-green-600" />
                  Yêu Cầu Công Việc
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả công việc
                    </label>
                    <div 
                      className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 min-h-[80px]"
                      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(jobRequirements.description || 'Chưa cập nhật') }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Yêu cầu ứng viên
                    </label>
                    <div 
                      className="px-3 py-2 bg-gray-50 rounded-md text-gray-900 min-h-[80px]"
                      dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(jobRequirements.requirements || 'Chưa cập nhật') }}
                    />
                    {/* Debug info */}
                    <div className="text-xs text-gray-500 mt-1">
                      Debug: {jobRequirements.requirements ? 'Có dữ liệu' : 'Không có dữ liệu'} - 
                      Length: {jobRequirements.requirements?.length || 0}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-8">
                  <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có thông tin công việc</h3>
                  <p className="text-gray-600">Vui lòng chọn một công việc để kiểm tra</p>
                </div>
              </div>
            )}

            <button
              onClick={analyzeCV}
              disabled={isAnalyzing || (!cvFile && !uploadedCV) || (!jobRequirements && !selectedPosition) || loadingProfile}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <FaStar className="w-5 h-5" />
                  Phân Tích CV
                </>
              )}
            </button>
          </div>

          {/* Right Side - Evaluation Results */}
          <div className="space-y-6">
            {isAnalyzing && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Đang phân tích CV...</h3>
                <p className="text-gray-600 mb-4">Hệ thống AI đang đánh giá sự phù hợp của CV với yêu cầu công việc</p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Đang trích xuất thông tin từ CV...</p>
                  <p>• Phân tích kỹ năng và kinh nghiệm...</p>
                  <p>• So sánh với yêu cầu công việc...</p>
                  <p>• Tạo đánh giá thông minh...</p>
                </div>
              </div>
            )}

            {analysisError && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-8">
                  <FaExclamationTriangle className="w-16 h-16 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi phân tích CV</h3>
                  <p className="text-gray-600 mb-4">{analysisError}</p>
                  <button
                    onClick={() => {
                      setAnalysisError(null);
                      analyzeCV();
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            )}

            {evaluation && !isAnalyzing && !analysisError && (
              <>
                {/* Overall Score */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Đánh Giá Tổng Quan</h2>
                  
                  {/* Target Position Info */}
                  {evaluation.targetPosition && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-sm text-blue-800">
                        <strong>Vị trí mục tiêu:</strong> {evaluation.targetPosition.category} - {evaluation.targetPosition.position}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-indigo-600">{evaluation.overallScore}/100</div>
                      <div className="text-sm text-gray-600">Điểm tổng thể</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{evaluation.matchScore}%</div>
                      <div className="text-sm text-gray-600">Độ phù hợp</div>
                    </div>
                  </div>

                  {/* Analysis Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Tóm Tắt Phân Tích</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">
                          {evaluation.matchingSkills?.length || 0}
                        </div>
                        <div className="text-gray-600">Kỹ năng phù hợp</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-red-600">
                          {evaluation.missingSkills?.length || 0}
                        </div>
                        <div className="text-gray-600">Kỹ năng thiếu</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-orange-600">
                          {evaluation.atsScore || 0}/100
                        </div>
                        <div className="text-gray-600">Điểm ATS</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaCheckCircle className="w-4 h-4 text-green-600" />
                        Điểm mạnh
                      </h3>
                      <ul className="space-y-2">
                        {evaluation.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">✓</span>
                            <span className="text-gray-700">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaExclamationTriangle className="w-4 h-4 text-yellow-600" />
                        Điểm cần cải thiện
                      </h3>
                      <ul className="space-y-2">
                        {evaluation.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-yellow-500 mt-1">⚠</span>
                            <span className="text-gray-700">{weakness}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <FaLightbulb className="w-4 h-4 text-blue-600" />
                        Gợi ý cải thiện
                      </h3>
                      <ul className="space-y-2">
                        {evaluation.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-500 mt-1">💡</span>
                            <span className="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Detailed Analysis */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Phân Tích Chi Tiết</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(evaluation.detailedAnalysis).map(([category, data]) => (
                      <div key={category} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900 capitalize">
                            {category === 'experience' && 'Kinh nghiệm'}
                            {category === 'education' && 'Học vấn'}
                            {category === 'skills' && 'Kỹ năng'}
                            {category === 'certifications' && 'Chứng chỉ'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(data.score)} ${getScoreColor(data.score)}`}>
                            {data.score}/100
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{data.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ATS Score */}
                {evaluation.atsScore > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Điểm ATS</h2>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{evaluation.atsScore}/100</div>
                      <div className="text-sm text-gray-600">Khả năng vượt qua hệ thống ATS</div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                      Điểm ATS đánh giá khả năng CV của bạn được hệ thống Applicant Tracking System (ATS) 
                      của các công ty nhận diện và xử lý tốt.
                    </p>
                  </div>
                )}

                {/* Skills Matching Analysis */}
                {evaluation.matchingSkills && evaluation.matchingSkills.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ Năng Phù Hợp</h2>
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        Tìm thấy {evaluation.matchingSkills.length} kỹ năng phù hợp với yêu cầu công việc
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.matchingSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {evaluation.missingSkills && evaluation.missingSkills.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ Năng Cần Bổ Sung</h2>
                    <div className="mb-3">
                      <span className="text-sm text-gray-600">
                        Cần bổ sung {evaluation.missingSkills.length} kỹ năng để đáp ứng yêu cầu công việc
                      </span>
                      {evaluation.apiResult?.matching_analysis?.missing_skills?.length > evaluation.missingSkills.length && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                          <strong>Lưu ý:</strong> Một số kỹ năng đã được lọc bỏ do định dạng không phù hợp
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {evaluation.missingSkills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                          ⚠ {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : evaluation.apiResult?.matching_analysis?.missing_skills?.length > 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Kỹ Năng Cần Bổ Sung</h2>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-sm text-yellow-800">
                        <strong>Lưu ý:</strong> Tất cả kỹ năng từ API đã được lọc bỏ do định dạng không phù hợp. 
                        Vui lòng kiểm tra lại nội dung JD hoặc thử lại.
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Intelligent Feedback */}
                {evaluation.intelligentFeedback && (
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Đánh Giá Thông Minh</h2>
                    {evaluation.isFallback && (
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="text-sm text-yellow-800">
                          <strong>⚠️ Lưu ý:</strong> Đang sử dụng đánh giá cơ bản do API không khả dụng. 
                          Kết quả này chỉ mang tính tham khảo.
                        </div>
                      </div>
                    )}
                    
                    {/* Overall Assessment */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2">Đánh Giá Tổng Quan</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {evaluation.intelligentFeedback}
                      </p>
                    </div>

                    {/* Strengths */}
                    {evaluation.strengths && evaluation.strengths.length > 0 && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaCheckCircle className="w-4 h-4 text-green-600" />
                          Điểm Mạnh
                        </h3>
                        <ul className="space-y-2">
                          {evaluation.strengths.map((strength, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1">✓</span>
                              <span className="text-gray-700">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Weaknesses */}
                    {evaluation.weaknesses && evaluation.weaknesses.length > 0 && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaExclamationTriangle className="w-4 h-4 text-red-600" />
                          Điểm Cần Cải Thiện
                        </h3>
                        <ul className="space-y-2">
                          {evaluation.weaknesses.map((weakness, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500 mt-1">⚠</span>
                              <span className="text-gray-700">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Specific Suggestions */}
                    {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaLightbulb className="w-4 h-4 text-purple-600" />
                          Gợi Ý Cụ Thể
                        </h3>
                        <ul className="space-y-2">
                          {evaluation.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-purple-500 mt-1">💡</span>
                              <span className="text-gray-700">{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Priority Actions */}
                    {evaluation.priorityActions && evaluation.priorityActions.length > 0 && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaStar className="w-4 h-4 text-orange-600" />
                          Hành Động Ưu Tiên
                        </h3>
                        <ul className="space-y-2">
                          {evaluation.priorityActions.map((action, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">⭐</span>
                              <span className="text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Encouragement */}
                    {evaluation.encouragement && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <FaHeart className="w-4 h-4 text-indigo-600" />
                          Lời Khuyến Khích
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {evaluation.encouragement}
                        </p>
                      </div>
                    )}
                  </div>
                )}


              </>
            )}

            {!evaluation && !isAnalyzing && !analysisError && (
              <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
                <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có đánh giá</h3>
                <p className="text-gray-600">Nhập thông tin CV và yêu cầu công việc, sau đó nhấn "Phân Tích CV" để xem kết quả</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CV Modal */}
      {showCVModal && cvFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowCVModal(false)}
            ></div>

            {/* Modal content */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal header */}
              <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaFileAlt className="w-6 h-6 text-indigo-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xem CV - {userProfile?.fullName || 'Ứng viên'}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(cvFile, '_blank')}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Mở trong tab mới
                  </button>
                  <button
                    onClick={() => setShowCVModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal body */}
              <div className="bg-white px-6 py-4">
                <div className="w-full h-96 border border-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src={cvFile}
                    className="w-full h-full"
                    title="CV Viewer"
                    onError={(e) => {
                      console.error('Error loading CV:', e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <FaFileAlt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Không thể hiển thị CV</p>
                      <button
                        onClick={() => window.open(cvFile, '_blank')}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Mở trong tab mới
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                <button
                  onClick={() => setShowCVModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVCheckPage; 