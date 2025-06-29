# Job Management API Documentation

## Tổng quan

JobController cung cấp các API để quản lý tin tuyển dụng, bao gồm đăng tin, cập nhật, tìm kiếm, lọc và báo cáo tin tuyển dụng.

## Base URL

```
/api/jobs
```

## Authentication

Hầu hết các API endpoints yêu cầu authentication thông qua middleware `auth`, trừ khi được chỉ định.

## API Endpoints

### 1. Đăng tin tuyển dụng

**POST** `/create`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "jobTitle": "Frontend Developer",
  "description": "Mô tả công việc chi tiết",
  "requirements": "Yêu cầu công việc",
  "benefits": "Quyền lợi",
  "salaryRange": {
    "min": 15000000,
    "max": 25000000,
    "currency": "VND"
  },
  "location": "Hà Nội",
  "jobType": "Full-time",
  "categoryId": "category_id_here",
  "skillsRequired": ["JavaScript", "React", "HTML", "CSS"],
  "experienceLevel": "Intermediate",
  "applicationDeadline": "2024-12-31",
  "isFeatured": false
}
```

**Response:**

```json
{
  "message": "Đăng tin tuyển dụng thành công",
  "job": {
    "_id": "job_id",
    "employerId": "employer_id",
    "jobTitle": "Frontend Developer",
    "description": "Mô tả công việc chi tiết",
    "requirements": "Yêu cầu công việc",
    "benefits": "Quyền lợi",
    "salaryRange": {
      "min": 15000000,
      "max": 25000000,
      "currency": "VND"
    },
    "location": "Hà Nội",
    "jobType": "Full-time",
    "categoryId": "category_id",
    "skillsRequired": ["JavaScript", "React", "HTML", "CSS"],
    "experienceLevel": "Intermediate",
    "applicationDeadline": "2024-12-31T00:00:00.000Z",
    "isFeatured": false,
    "status": "Active",
    "postedDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Lấy danh sách tin tuyển dụng của nhà tuyển dụng

**GET** `/employer?page=1&limit=10&status=Active`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `status` (optional): Lọc theo trạng thái

**Response:**

```json
{
  "jobs": [
    {
      "_id": "job_id",
      "employerId": "employer_id",
      "jobTitle": "Frontend Developer",
      "description": "Mô tả công việc",
      "location": "Hà Nội",
      "jobType": "Full-time",
      "categoryId": {
        "_id": "category_id",
        "name": "Công nghệ"
      },
      "status": "Active",
      "postedDate": "2024-01-01T00:00:00.000Z"
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

### 3. Lấy chi tiết tin tuyển dụng

**GET** `/detail/:jobId`

**Response:**

```json
{
  "job": {
    "_id": "job_id",
    "employerId": {
      "_id": "employer_id",
      "companyName": "Tên công ty",
      "companyDescription": "Mô tả công ty",
      "companyLogoUrl": "logo_url"
    },
    "jobTitle": "Frontend Developer",
    "description": "Mô tả công việc chi tiết",
    "requirements": "Yêu cầu công việc",
    "benefits": "Quyền lợi",
    "salaryRange": {
      "min": 15000000,
      "max": 25000000,
      "currency": "VND"
    },
    "location": "Hà Nội",
    "jobType": "Full-time",
    "categoryId": {
      "_id": "category_id",
      "name": "Công nghệ"
    },
    "skillsRequired": ["JavaScript", "React", "HTML", "CSS"],
    "experienceLevel": "Intermediate",
    "applicationDeadline": "2024-12-31T00:00:00.000Z",
    "isFeatured": false,
    "status": "Active",
    "viewsCount": 150,
    "postedDate": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Cập nhật tin tuyển dụng

**PUT** `/update/:jobId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "jobTitle": "Senior Frontend Developer",
  "description": "Mô tả công việc cập nhật",
  "salaryRange": {
    "min": 20000000,
    "max": 35000000,
    "currency": "VND"
  },
  "isFeatured": true
}
```

**Response:**

```json
{
  "message": "Cập nhật tin tuyển dụng thành công",
  "job": {
    "_id": "job_id",
    "jobTitle": "Senior Frontend Developer",
    "description": "Mô tả công việc cập nhật",
    "salaryRange": {
      "min": 20000000,
      "max": 35000000,
      "currency": "VND"
    },
    "isFeatured": true
  }
}
```

### 5. Xóa tin tuyển dụng

**DELETE** `/delete/:jobId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Xóa tin tuyển dụng thành công"
}
```

### 6. Tìm kiếm tin tuyển dụng

**GET** `/search?q=frontend&location=Hà Nội&jobType=Full-time&page=1&limit=10`

**Query Parameters:**

- `q` (optional): Từ khóa tìm kiếm
- `location` (optional): Địa điểm
- `jobType` (optional): Loại công việc
- `categoryId` (optional): ID danh mục
- `experienceLevel` (optional): Cấp độ kinh nghiệm
- `salaryMin` (optional): Lương tối thiểu
- `salaryMax` (optional): Lương tối đa
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "jobs": [
    {
      "_id": "job_id",
      "employerId": {
        "_id": "employer_id",
        "companyName": "Tên công ty",
        "companyLogoUrl": "logo_url"
      },
      "jobTitle": "Frontend Developer",
      "description": "Mô tả công việc",
      "location": "Hà Nội",
      "jobType": "Full-time",
      "salaryRange": {
        "min": 15000000,
        "max": 25000000,
        "currency": "VND"
      },
      "experienceLevel": "Intermediate",
      "postedDate": "2024-01-01T00:00:00.000Z",
      "viewsCount": 150
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "filters": {
    "q": "frontend",
    "location": "Hà Nội",
    "jobType": "Full-time"
  }
}
```

### 7. Lọc tin tuyển dụng

**GET** `/filter?categoryId=category_id&experienceLevel=Intermediate&salaryMin=15000000&page=1&limit=10`

**Query Parameters:**

- `categoryId` (optional): ID danh mục
- `experienceLevel` (optional): Cấp độ kinh nghiệm
- `salaryMin` (optional): Lương tối thiểu
- `salaryMax` (optional): Lương tối đa
- `jobType` (optional): Loại công việc
- `location` (optional): Địa điểm
- `isFeatured` (optional): Tin nổi bật (true/false)
- `sortBy` (optional): Sắp xếp theo (postedDate, salary, viewsCount)
- `sortOrder` (optional): Thứ tự sắp xếp (asc/desc)
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "jobs": [
    {
      "_id": "job_id",
      "employerId": {
        "_id": "employer_id",
        "companyName": "Tên công ty",
        "companyLogoUrl": "logo_url"
      },
      "jobTitle": "Frontend Developer",
      "location": "Hà Nội",
      "jobType": "Full-time",
      "salaryRange": {
        "min": 15000000,
        "max": 25000000,
        "currency": "VND"
      },
      "experienceLevel": "Intermediate",
      "postedDate": "2024-01-01T00:00:00.000Z",
      "viewsCount": 150
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  },
  "filters": {
    "categoryId": "category_id",
    "experienceLevel": "Intermediate",
    "salaryMin": 15000000
  }
}
```

### 8. Báo cáo tin tuyển dụng

**POST** `/report/:jobId`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "reason": "Thông tin không chính xác"
}
```

**Response:**

```json
{
  "message": "Báo cáo tin tuyển dụng thành công"
}
```

### 9. Chia sẻ tin tuyển dụng

**POST** `/share/:jobId`

**Request Body:**

```json
{
  "platform": "facebook",
  "message": "Tin tuyển dụng hay!"
}
```

**Response:**

```json
{
  "message": "Chia sẻ tin tuyển dụng thành công",
  "shareUrl": "https://facebook.com/share/..."
}
```

### 10. Lấy tin tuyển dụng nổi bật

**GET** `/featured?page=1&limit=10`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "jobs": [
    {
      "_id": "job_id",
      "employerId": {
        "_id": "employer_id",
        "companyName": "Tên công ty",
        "companyLogoUrl": "logo_url"
      },
      "jobTitle": "Frontend Developer",
      "location": "Hà Nội",
      "jobType": "Full-time",
      "salaryRange": {
        "min": 15000000,
        "max": 25000000,
        "currency": "VND"
      },
      "isFeatured": true,
      "postedDate": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

### 11. Lấy tin tuyển dụng mới nhất

**GET** `/latest?page=1&limit=10`

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)

**Response:**

```json
{
  "jobs": [
    {
      "_id": "job_id",
      "employerId": {
        "_id": "employer_id",
        "companyName": "Tên công ty",
        "companyLogoUrl": "logo_url"
      },
      "jobTitle": "Frontend Developer",
      "location": "Hà Nội",
      "jobType": "Full-time",
      "postedDate": "2024-01-01T00:00:00.000Z"
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

### 12. Thống kê tin tuyển dụng

**GET** `/stats?employerId=employer_id`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**

- `employerId` (optional): ID nhà tuyển dụng

**Response:**

```json
{
  "success": true,
  "data": {
    "totalJobs": 50,
    "activeJobs": 30,
    "closedJobs": 20,
    "featuredJobs": 5,
    "totalViews": 1500,
    "averageViews": 30,
    "jobsByCategory": {
      "Công nghệ": 25,
      "Marketing": 15,
      "Sales": 10
    },
    "jobsByLocation": {
      "Hà Nội": 30,
      "TP.HCM": 20
    }
  }
}
```

## Trạng thái tin tuyển dụng

- `Active`: Đang hoạt động
- `Closed`: Đã đóng
- `Draft`: Bản nháp
- `Expired`: Hết hạn

## Loại công việc

- `Full-time`: Toàn thời gian
- `Part-time`: Bán thời gian
- `Contract`: Hợp đồng
- `Internship`: Thực tập
- `Remote`: Làm việc từ xa

## Cấp độ kinh nghiệm

- `Entry-level`: Mới bắt đầu
- `Intermediate`: Trung cấp
- `Senior`: Cao cấp
- `Expert`: Chuyên gia

## Nền tảng chia sẻ

- `facebook`: Facebook
- `twitter`: Twitter
- `linkedin`: LinkedIn
- `email`: Email

## Lưu ý

- Chỉ nhà tuyển dụng mới có thể đăng, cập nhật, xóa tin tuyển dụng
- Tin tuyển dụng tự động tăng lượt xem khi được xem chi tiết
- Tìm kiếm hỗ trợ full-text search
- Lọc hỗ trợ nhiều tiêu chí kết hợp
- Thống kê bao gồm phân tích theo danh mục và địa điểm
