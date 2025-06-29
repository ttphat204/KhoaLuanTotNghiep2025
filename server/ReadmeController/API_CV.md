# CV Management API Documentation

## Tổng quan

CVController cung cấp các API để quản lý CV/Resume của ứng viên, bao gồm tạo, cập nhật, xóa CV và quản lý các thành phần như học vấn, kinh nghiệm làm việc, kỹ năng, ngôn ngữ, chứng chỉ và dự án.

## Base URL

```
/api/cv
```

## Authentication

Tất cả các API endpoints đều yêu cầu authentication thông qua middleware `auth`.

## API Endpoints

### 1. Tạo CV mới

**POST** `/create`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "title": "CV Frontend Developer",
  "isPrimary": false
}
```

**Response:**

```json
{
  "message": "Tạo CV thành công",
  "resume": {
    "_id": "resume_id",
    "candidateId": "candidate_id",
    "title": "CV Frontend Developer",
    "isPrimary": false,
    "sections": {
      "education": [],
      "workExperience": [],
      "skills": [],
      "languages": [],
      "projects": [],
      "certifications": []
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Lấy danh sách CV

**GET** `/list`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "resumes": [
    {
      "_id": "resume_id",
      "candidateId": "candidate_id",
      "title": "CV Frontend Developer",
      "fileName": "cv.pdf",
      "fileUrl": "file_url",
      "isPrimary": true,
      "lastUsed": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 3
}
```

### 3. Lấy chi tiết CV

**GET** `/detail/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "resume": {
    "_id": "resume_id",
    "candidateId": "candidate_id",
    "title": "CV Frontend Developer",
    "fileName": "cv.pdf",
    "fileUrl": "file_url",
    "isPrimary": true,
    "lastUsed": "2024-01-01T00:00:00.000Z",
    "sections": {
      "education": [
        {
          "_id": "education_id",
          "degree": "Cử nhân",
          "major": "Công nghệ thông tin",
          "institution": "Đại học ABC",
          "startDate": "2018-09-01T00:00:00.000Z",
          "endDate": "2022-06-01T00:00:00.000Z",
          "description": "Mô tả học vấn"
        }
      ],
      "workExperience": [
        {
          "_id": "experience_id",
          "jobTitle": "Frontend Developer",
          "companyName": "Công ty ABC",
          "startDate": "2022-07-01T00:00:00.000Z",
          "endDate": null,
          "description": "Mô tả công việc"
        }
      ],
      "skills": [
        {
          "_id": "skill_id",
          "name": "JavaScript",
          "level": "Advanced"
        }
      ],
      "languages": [
        {
          "_id": "language_id",
          "name": "Tiếng Anh",
          "proficiency": "Fluent"
        }
      ],
      "projects": [
        {
          "_id": "project_id",
          "name": "Dự án ABC",
          "description": "Mô tả dự án",
          "startDate": "2023-01-01T00:00:00.000Z",
          "endDate": "2023-06-01T00:00:00.000Z",
          "projectUrl": "https://project.com"
        }
      ],
      "certifications": [
        {
          "_id": "certification_id",
          "name": "AWS Certified Developer",
          "issuingOrganization": "Amazon",
          "issueDate": "2023-01-01T00:00:00.000Z",
          "expirationDate": "2026-01-01T00:00:00.000Z",
          "credentialId": "AWS123456",
          "credentialUrl": "https://aws.amazon.com"
        }
      ]
    }
  }
}
```

### 4. Cập nhật thông tin CV

**PUT** `/update/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "title": "CV Senior Frontend Developer",
  "isPrimary": true
}
```

**Response:**

```json
{
  "message": "Cập nhật CV thành công",
  "resume": {
    "_id": "resume_id",
    "title": "CV Senior Frontend Developer",
    "isPrimary": true
  }
}
```

### 5. Xóa CV

**DELETE** `/delete/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa CV thành công"
}
```

### 6. Upload file CV

**POST** `/upload/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Form Data:**

- `file`: File CV (PDF, DOC, DOCX)

**Response:**

```json
{
  "message": "Upload file CV thành công",
  "resume": {
    "_id": "resume_id",
    "fileName": "cv.pdf",
    "fileUrl": "uploads/cv.pdf"
  }
}
```

### 7. Thêm học vấn

**POST** `/education/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "degree": "Thạc sĩ",
  "major": "Khoa học máy tính",
  "institution": "Đại học XYZ",
  "startDate": "2022-09-01",
  "endDate": "2024-06-01",
  "description": "Mô tả học vấn"
}
```

**Response:**

```json
{
  "message": "Thêm học vấn thành công",
  "education": {
    "_id": "education_id",
    "degree": "Thạc sĩ",
    "major": "Khoa học máy tính",
    "institution": "Đại học XYZ",
    "startDate": "2022-09-01T00:00:00.000Z",
    "endDate": "2024-06-01T00:00:00.000Z",
    "description": "Mô tả học vấn"
  }
}
```

### 8. Cập nhật học vấn

**PUT** `/education/:resumeId/:educationId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "degree": "Thạc sĩ",
  "major": "Khoa học máy tính",
  "institution": "Đại học XYZ",
  "startDate": "2022-09-01",
  "endDate": "2024-06-01",
  "description": "Mô tả học vấn cập nhật"
}
```

**Response:**

```json
{
  "message": "Cập nhật học vấn thành công",
  "education": {
    "_id": "education_id",
    "degree": "Thạc sĩ",
    "major": "Khoa học máy tính",
    "institution": "Đại học XYZ",
    "startDate": "2022-09-01T00:00:00.000Z",
    "endDate": "2024-06-01T00:00:00.000Z",
    "description": "Mô tả học vấn cập nhật"
  }
}
```

### 9. Xóa học vấn

**DELETE** `/education/:resumeId/:educationId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa học vấn thành công"
}
```

### 10. Thêm kinh nghiệm làm việc

**POST** `/experience/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "jobTitle": "Senior Frontend Developer",
  "companyName": "Công ty XYZ",
  "startDate": "2023-01-01",
  "endDate": null,
  "description": "Mô tả công việc chi tiết"
}
```

**Response:**

```json
{
  "message": "Thêm kinh nghiệm làm việc thành công",
  "experience": {
    "_id": "experience_id",
    "jobTitle": "Senior Frontend Developer",
    "companyName": "Công ty XYZ",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": null,
    "description": "Mô tả công việc chi tiết"
  }
}
```

### 11. Cập nhật kinh nghiệm làm việc

**PUT** `/experience/:resumeId/:experienceId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "jobTitle": "Lead Frontend Developer",
  "companyName": "Công ty XYZ",
  "startDate": "2023-01-01",
  "endDate": "2024-01-01",
  "description": "Mô tả công việc cập nhật"
}
```

**Response:**

```json
{
  "message": "Cập nhật kinh nghiệm làm việc thành công",
  "experience": {
    "_id": "experience_id",
    "jobTitle": "Lead Frontend Developer",
    "companyName": "Công ty XYZ",
    "startDate": "2023-01-01T00:00:00.000Z",
    "endDate": "2024-01-01T00:00:00.000Z",
    "description": "Mô tả công việc cập nhật"
  }
}
```

### 12. Xóa kinh nghiệm làm việc

**DELETE** `/experience/:resumeId/:experienceId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa kinh nghiệm làm việc thành công"
}
```

### 13. Thêm kỹ năng

**POST** `/skill/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "React",
  "level": "Advanced"
}
```

**Response:**

```json
{
  "message": "Thêm kỹ năng thành công",
  "skill": {
    "_id": "skill_id",
    "name": "React",
    "level": "Advanced"
  }
}
```

### 14. Cập nhật kỹ năng

**PUT** `/skill/:resumeId/:skillId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "React.js",
  "level": "Expert"
}
```

**Response:**

```json
{
  "message": "Cập nhật kỹ năng thành công",
  "skill": {
    "_id": "skill_id",
    "name": "React.js",
    "level": "Expert"
  }
}
```

### 15. Xóa kỹ năng

**DELETE** `/skill/:resumeId/:skillId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa kỹ năng thành công"
}
```

### 16. Thêm ngôn ngữ

**POST** `/language/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Tiếng Nhật",
  "proficiency": "Intermediate"
}
```

**Response:**

```json
{
  "message": "Thêm ngôn ngữ thành công",
  "language": {
    "_id": "language_id",
    "name": "Tiếng Nhật",
    "proficiency": "Intermediate"
  }
}
```

### 17. Cập nhật ngôn ngữ

**PUT** `/language/:resumeId/:languageId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Tiếng Nhật",
  "proficiency": "Advanced"
}
```

**Response:**

```json
{
  "message": "Cập nhật ngôn ngữ thành công",
  "language": {
    "_id": "language_id",
    "name": "Tiếng Nhật",
    "proficiency": "Advanced"
  }
}
```

### 18. Xóa ngôn ngữ

**DELETE** `/language/:resumeId/:languageId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa ngôn ngữ thành công"
}
```

### 19. Thêm chứng chỉ

**POST** `/certification/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Google Cloud Certified",
  "issuingOrganization": "Google",
  "issueDate": "2023-06-01",
  "expirationDate": "2026-06-01",
  "credentialId": "GCP123456",
  "credentialUrl": "https://google.com"
}
```

**Response:**

```json
{
  "message": "Thêm chứng chỉ thành công",
  "certification": {
    "_id": "certification_id",
    "name": "Google Cloud Certified",
    "issuingOrganization": "Google",
    "issueDate": "2023-06-01T00:00:00.000Z",
    "expirationDate": "2026-06-01T00:00:00.000Z",
    "credentialId": "GCP123456",
    "credentialUrl": "https://google.com"
  }
}
```

### 20. Cập nhật chứng chỉ

**PUT** `/certification/:resumeId/:certificationId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "Google Cloud Professional",
  "issuingOrganization": "Google",
  "issueDate": "2023-06-01",
  "expirationDate": "2026-06-01",
  "credentialId": "GCP123456",
  "credentialUrl": "https://google.com"
}
```

**Response:**

```json
{
  "message": "Cập nhật chứng chỉ thành công",
  "certification": {
    "_id": "certification_id",
    "name": "Google Cloud Professional",
    "issuingOrganization": "Google",
    "issueDate": "2023-06-01T00:00:00.000Z",
    "expirationDate": "2026-06-01T00:00:00.000Z",
    "credentialId": "GCP123456",
    "credentialUrl": "https://google.com"
  }
}
```

### 21. Xóa chứng chỉ

**DELETE** `/certification/:resumeId/:certificationId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa chứng chỉ thành công"
}
```

### 22. Thêm dự án

**POST** `/project/:resumeId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "E-commerce Platform",
  "description": "Xây dựng nền tảng thương mại điện tử",
  "startDate": "2023-03-01",
  "endDate": "2023-08-01",
  "projectUrl": "https://project.com"
}
```

**Response:**

```json
{
  "message": "Thêm dự án thành công",
  "project": {
    "_id": "project_id",
    "name": "E-commerce Platform",
    "description": "Xây dựng nền tảng thương mại điện tử",
    "startDate": "2023-03-01T00:00:00.000Z",
    "endDate": "2023-08-01T00:00:00.000Z",
    "projectUrl": "https://project.com"
  }
}
```

### 23. Cập nhật dự án

**PUT** `/project/:resumeId/:projectId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "name": "E-commerce Platform v2",
  "description": "Xây dựng nền tảng thương mại điện tử phiên bản 2",
  "startDate": "2023-03-01",
  "endDate": "2023-09-01",
  "projectUrl": "https://project-v2.com"
}
```

**Response:**

```json
{
  "message": "Cập nhật dự án thành công",
  "project": {
    "_id": "project_id",
    "name": "E-commerce Platform v2",
    "description": "Xây dựng nền tảng thương mại điện tử phiên bản 2",
    "startDate": "2023-03-01T00:00:00.000Z",
    "endDate": "2023-09-01T00:00:00.000Z",
    "projectUrl": "https://project-v2.com"
  }
}
```

### 24. Xóa dự án

**DELETE** `/project/:resumeId/:projectId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa dự án thành công"
}
```

## Cấp độ kỹ năng

- `Beginner`: Mới bắt đầu
- `Intermediate`: Trung cấp
- `Advanced`: Cao cấp
- `Expert`: Chuyên gia

## Trình độ ngôn ngữ

- `Native`: Tiếng mẹ đẻ
- `Fluent`: Thành thạo
- `Advanced`: Cao cấp
- `Intermediate`: Trung cấp
- `Basic`: Cơ bản

## Loại file hỗ trợ

- PDF
- DOC
- DOCX

## Lưu ý

- Chỉ ứng viên mới có thể quản lý CV
- Mỗi ứng viên chỉ có một CV primary
- File CV được lưu trong thư mục uploads
- Tất cả các thành phần CV đều có thể CRUD
- CV được sắp xếp theo primary và thời gian cập nhật
