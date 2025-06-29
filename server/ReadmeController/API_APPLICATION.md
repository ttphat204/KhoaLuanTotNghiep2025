# Application API Documentation

## Tổng quan

ApplicationController cung cấp các API để quản lý ứng tuyển, bao gồm lưu việc yêu thích, xem lịch sử ứng tuyển, nộp hồ sơ và quản lý trạng thái ứng tuyển.

## Base URL

```
/api/applications
```

## Authentication

Tất cả các API endpoints đều yêu cầu authentication thông qua middleware `auth`.

## API Endpoints

### 1. Lưu/Bỏ yêu thích công việc

**POST** `/favorites/toggle`

**Request Body:**

```json
{
  "candidateId": "candidate_id_here",
  "jobId": "job_id_here"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đã thêm vào danh sách yêu thích",
  "isFavorite": true
}
```

### 2. Xem danh sách việc làm yêu thích

**GET** `/favorites?candidateId=candidate_id&page=1&limit=10`

**Query Parameters:**

- `candidateId` (required): ID của ứng viên
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "favorite_id",
      "candidateId": "candidate_id",
      "jobId": {
        "_id": "job_id",
        "title": "Job Title",
        "employerId": {
          "companyName": "Company Name",
          "logo": "logo_url"
        }
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 3. Xem lịch sử ứng tuyển

**GET** `/history?candidateId=candidate_id&page=1&limit=10&status=Pending`

**Query Parameters:**

- `candidateId` (required): ID của ứng viên
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `status` (optional): Lọc theo trạng thái

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "application_id",
      "candidateId": "candidate_id",
      "jobId": {
        "_id": "job_id",
        "title": "Job Title",
        "employerId": {
          "companyName": "Company Name",
          "logo": "logo_url"
        }
      },
      "resumeId": {
        "title": "Resume Title",
        "fileName": "resume.pdf"
      },
      "status": "Pending",
      "applicationDate": "2024-01-01T00:00:00.000Z",
      "lastStatusUpdate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 4. Xem việc làm chờ ứng tuyển (trạng thái CV)

**GET** `/pending?candidateId=candidate_id&page=1&limit=10`

**Query Parameters:**

- `candidateId` (required): ID của ứng viên
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "application_id",
      "candidateId": "candidate_id",
      "jobId": {
        "_id": "job_id",
        "title": "Job Title",
        "employerId": {
          "companyName": "Company Name",
          "logo": "logo_url"
        }
      },
      "resumeId": {
        "title": "Resume Title",
        "fileName": "resume.pdf"
      },
      "status": "Pending",
      "applicationDate": "2024-01-01T00:00:00.000Z",
      "lastStatusUpdate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 5. Nộp hồ sơ

**POST** `/submit`

**Request Body:**

```json
{
  "candidateId": "candidate_id_here",
  "jobId": "job_id_here",
  "resumeId": "resume_id_here",
  "coverLetter": "Cover letter content (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Nộp hồ sơ thành công",
  "data": {
    "_id": "application_id",
    "candidateId": "candidate_id",
    "jobId": "job_id",
    "resumeId": "resume_id",
    "status": "Pending",
    "applicationDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 6. Xem thống kê ứng tuyển (cho ứng viên)

**GET** `/stats?candidateId=candidate_id`

**Query Parameters:**

- `candidateId` (required): ID của ứng viên

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 50,
    "pending": 20,
    "interviewing": 10,
    "offer": 5,
    "hired": 10,
    "rejected": 5
  }
}
```

### 7. Xem/tải về hồ sơ ứng viên (cho nhà tuyển dụng)

**GET** `/candidate/:applicationId?employerId=employer_id`

**Path Parameters:**

- `applicationId`: ID của đơn ứng tuyển

**Query Parameters:**

- `employerId` (required): ID của nhà tuyển dụng

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "application_id",
    "candidateId": "candidate_id",
    "jobId": {
      "_id": "job_id",
      "title": "Job Title"
    },
    "resumeId": {
      "_id": "resume_id",
      "title": "Resume Title",
      "fileName": "resume.pdf",
      "fileUrl": "resume_url",
      "candidateId": {
        "fullName": "Candidate Name",
        "email": "candidate@email.com",
        "phone": "phone_number",
        "avatar": "avatar_url"
      }
    },
    "status": "Pending",
    "coverLetter": "Cover letter content",
    "applicationDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 8. Lọc/sắp xếp hồ sơ ứng viên (cho nhà tuyển dụng)

**GET** `/filter?employerId=employer_id&jobId=job_id&status=Pending&sortBy=applicationDate&sortOrder=desc&page=1&limit=10&search=search_term`

**Query Parameters:**

- `employerId` (required): ID của nhà tuyển dụng
- `jobId` (optional): Lọc theo công việc
- `status` (optional): Lọc theo trạng thái
- `sortBy` (optional): Sắp xếp theo trường (default: applicationDate)
- `sortOrder` (optional): Thứ tự sắp xếp (asc/desc, default: desc)
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `search` (optional): Tìm kiếm theo tên hoặc email ứng viên

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "application_id",
      "candidateId": {
        "fullName": "Candidate Name",
        "email": "candidate@email.com",
        "phone": "phone_number",
        "avatar": "avatar_url"
      },
      "jobId": {
        "title": "Job Title"
      },
      "resumeId": {
        "title": "Resume Title",
        "fileName": "resume.pdf"
      },
      "status": "Pending",
      "applicationDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "filters": {
    "jobId": "job_id",
    "status": "Pending",
    "sortBy": "applicationDate",
    "sortOrder": "desc",
    "search": "search_term"
  }
}
```

### 9. Cập nhật trạng thái đơn ứng tuyển (cho nhà tuyển dụng)

**PUT** `/status/:applicationId`

**Path Parameters:**

- `applicationId`: ID của đơn ứng tuyển

**Request Body:**

```json
{
  "status": "Interviewing",
  "employerId": "employer_id_here",
  "note": "Ghi chú (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật trạng thái thành công",
  "data": {
    "_id": "application_id",
    "candidateId": "candidate_id",
    "jobId": "job_id",
    "status": "Interviewing",
    "note": "Ghi chú",
    "lastStatusUpdate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 10. Xem thống kê ứng tuyển (cho nhà tuyển dụng)

**GET** `/employer/stats?employerId=employer_id`

**Query Parameters:**

- `employerId` (required): ID của nhà tuyển dụng

**Response:**

```json
{
  "success": true,
  "data": {
    "total": 100,
    "pending": 30,
    "interviewing": 20,
    "offer": 10,
    "hired": 25,
    "rejected": 15
  }
}
```

## Trạng thái ứng tuyển

- `Pending`: Chờ xem xét
- `Reviewed`: Đã xem xét
- `Interviewing`: Đang phỏng vấn
- `Offer`: Đã có lời mời làm việc
- `Rejected`: Bị từ chối
- `Hired`: Đã được tuyển dụng

## Thông báo tự động

Hệ thống sẽ tự động tạo thông báo khi:

- Ứng viên nộp hồ sơ thành công
- Nhà tuyển dụng nhận được đơn ứng tuyển mới
- Trạng thái đơn ứng tuyển được cập nhật

## Lưu ý

- Tất cả các API đều yêu cầu authentication
- Nhà tuyển dụng chỉ có thể xem và quản lý đơn ứng tuyển của các công việc thuộc về mình
- Ứng viên chỉ có thể xem đơn ứng tuyển của chính mình
- Hệ thống tự động ngăn chặn việc ứng tuyển trùng lặp cho cùng một công việc
