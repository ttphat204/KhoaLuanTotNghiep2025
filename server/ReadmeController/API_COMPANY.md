# Company API Documentation

## Tổng quan

CompanyController cung cấp các API để quản lý thông tin công ty, bao gồm xây dựng trang công ty, xem hồ sơ công ty, đánh giá/review công ty và xem thống kê báo cáo.

## Base URL

```
/api/companies
```

## Authentication

Một số API endpoints yêu cầu authentication thông qua middleware `auth`.

## API Endpoints

### 1. Cập nhật thông tin công ty

**PUT** `/profile/:employerId`

**Path Parameters:**

- `employerId`: ID của nhà tuyển dụng

**Request Body:**

```json
{
  "companyName": "Tên công ty mới",
  "companyDescription": "Mô tả công ty",
  "companyWebsite": "https://company.com",
  "industry": "Công nghệ",
  "companySize": "51-200",
  "foundedYear": 2020
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật thông tin công ty thành công",
  "data": {
    "_id": "employer_id",
    "companyName": "Tên công ty mới",
    "companyEmail": "company@email.com",
    "companyPhoneNumber": "0123456789",
    "companyAddress": "Địa chỉ công ty",
    "companyWebsite": "https://company.com",
    "companyDescription": "Mô tả công ty",
    "companyLogoUrl": "logo_url",
    "industry": "Công nghệ",
    "companySize": "51-200",
    "foundedYear": 2020,
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 2. Xem hồ sơ công ty

**GET** `/profile/:employerId`

**Path Parameters:**

- `employerId`: ID của nhà tuyển dụng

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "employer_id",
    "companyName": "Tên công ty",
    "companyEmail": "company@email.com",
    "companyPhoneNumber": "0123456789",
    "companyAddress": "Địa chỉ công ty",
    "companyWebsite": "https://company.com",
    "companyDescription": "Mô tả công ty",
    "companyLogoUrl": "logo_url",
    "industry": "Công nghệ",
    "companySize": "51-200",
    "foundedYear": 2020,
    "userId": {
      "_id": "user_id",
      "email": "company@email.com"
    },
    "stats": {
      "totalJobs": 50,
      "activeJobs": 20,
      "totalReviews": 15,
      "averageRating": 4.2
    }
  }
}
```

### 3. Tìm kiếm công ty

**GET** `/search?search=search_term&industry=industry&companySize=size&page=1&limit=10&sortBy=companyName&sortOrder=asc`

**Query Parameters:**

- `search` (optional): Tìm kiếm theo tên công ty
- `industry` (optional): Lọc theo ngành nghề
- `companySize` (optional): Lọc theo quy mô công ty
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `sortBy` (optional): Sắp xếp theo trường (default: companyName)
- `sortOrder` (optional): Thứ tự sắp xếp (asc/desc, default: asc)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "employer_id",
      "companyName": "Tên công ty",
      "companyLogoUrl": "logo_url",
      "industry": "Công nghệ",
      "companySize": "51-200",
      "foundedYear": 2020,
      "stats": {
        "activeJobs": 20,
        "totalReviews": 15
      }
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

### 4. Lấy danh sách ngành nghề

**GET** `/industries`

**Response:**

```json
{
  "success": true,
  "data": ["Công nghệ", "Tài chính", "Y tế", "Giáo dục", "Thương mại điện tử"]
}
```

### 5. Lấy danh sách quy mô công ty

**GET** `/sizes`

**Response:**

```json
{
  "success": true,
  "data": ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]
}
```

### 6. Tạo đánh giá công ty

**POST** `/reviews`

**Request Body:**

```json
{
  "candidateId": "candidate_id_here",
  "companyId": "company_id_here",
  "rating": 5,
  "title": "Công ty tuyệt vời",
  "reviewText": "Môi trường làm việc tốt, đồng nghiệp thân thiện",
  "anonymous": false
}
```

**Response:**

```json
{
  "success": true,
  "message": "Đánh giá công ty thành công",
  "data": {
    "_id": "review_id",
    "candidateId": "candidate_id",
    "companyId": "company_id",
    "rating": 5,
    "title": "Công ty tuyệt vời",
    "reviewText": "Môi trường làm việc tốt, đồng nghiệp thân thiện",
    "anonymous": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 7. Xem danh sách đánh giá công ty

**GET** `/reviews?companyId=company_id&page=1&limit=10&rating=5&sortBy=createdAt&sortOrder=desc`

**Query Parameters:**

- `companyId` (required): ID của công ty
- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `rating` (optional): Lọc theo rating
- `sortBy` (optional): Sắp xếp theo trường (default: createdAt)
- `sortOrder` (optional): Thứ tự sắp xếp (asc/desc, default: desc)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "review_id",
      "candidateId": {
        "fullName": "Tên ứng viên",
        "avatar": "avatar_url"
      },
      "companyId": "company_id",
      "rating": 5,
      "title": "Công ty tuyệt vời",
      "reviewText": "Môi trường làm việc tốt",
      "anonymous": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "stats": {
    "totalReviews": 15,
    "averageRating": 4.2,
    "ratingDistribution": {
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5
    }
  },
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 15,
    "itemsPerPage": 10
  }
}
```

### 8. Cập nhật đánh giá công ty

**PUT** `/reviews/:reviewId`

**Path Parameters:**

- `reviewId`: ID của đánh giá

**Request Body:**

```json
{
  "rating": 4,
  "title": "Công ty tốt",
  "reviewText": "Môi trường làm việc khá tốt",
  "anonymous": true
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật đánh giá thành công",
  "data": {
    "_id": "review_id",
    "rating": 4,
    "title": "Công ty tốt",
    "reviewText": "Môi trường làm việc khá tốt",
    "anonymous": true
  }
}
```

### 9. Xóa đánh giá công ty

**DELETE** `/reviews/:reviewId`

**Path Parameters:**

- `reviewId`: ID của đánh giá

**Response:**

```json
{
  "success": true,
  "message": "Xóa đánh giá thành công"
}
```

### 10. Xem thống kê báo cáo công ty

**GET** `/stats/:employerId?startDate=2024-01-01&endDate=2024-12-31`

**Path Parameters:**

- `employerId`: ID của nhà tuyển dụng

**Query Parameters:**

- `startDate` (optional): Ngày bắt đầu
- `endDate` (optional): Ngày kết thúc

**Response:**

```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 50,
      "activeJobs": 20,
      "closedJobs": 30,
      "totalApplications": 200,
      "totalReviews": 15,
      "totalReports": 5,
      "averageRating": 4.2
    },
    "applications": {
      "byStatus": {
        "Pending": 50,
        "Reviewed": 30,
        "Interviewing": 20,
        "Offer": 10,
        "Hired": 15,
        "Rejected": 75
      }
    },
    "reports": {
      "byStatus": {
        "Pending": 3,
        "Resolved": 1,
        "Ignored": 1
      }
    },
    "monthlyStats": [
      {
        "month": "2024-01",
        "jobCount": 5
      },
      {
        "month": "2024-02",
        "jobCount": 8
      }
    ]
  }
}
```

### 11. Xem danh sách báo cáo công việc của công ty

**GET** `/reports/:employerId?page=1&limit=10&status=Pending`

**Path Parameters:**

- `employerId`: ID của nhà tuyển dụng

**Query Parameters:**

- `page` (optional): Trang hiện tại (default: 1)
- `limit` (optional): Số lượng item mỗi trang (default: 10)
- `status` (optional): Lọc theo trạng thái

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "report_id",
      "jobId": {
        "_id": "job_id",
        "title": "Tên công việc"
      },
      "reporterId": {
        "fullName": "Tên người báo cáo",
        "email": "reporter@email.com"
      },
      "reason": "Lý do báo cáo",
      "status": "Pending",
      "reportedAt": "2024-01-01T00:00:00.000Z"
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

### 12. Cập nhật trạng thái báo cáo

**PUT** `/reports/:reportId/status`

**Path Parameters:**

- `reportId`: ID của báo cáo

**Request Body:**

```json
{
  "status": "Resolved"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Cập nhật trạng thái báo cáo thành công",
  "data": {
    "_id": "report_id",
    "jobId": "job_id",
    "reporterId": "reporter_id",
    "reason": "Lý do báo cáo",
    "status": "Resolved",
    "reportedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Trạng thái báo cáo

- `Pending`: Chờ xử lý
- `Resolved`: Đã xử lý
- `Ignored`: Bỏ qua

## Quy mô công ty

- `1-10`: 1-10 nhân viên
- `11-50`: 11-50 nhân viên
- `51-200`: 51-200 nhân viên
- `201-500`: 201-500 nhân viên
- `501-1000`: 501-1000 nhân viên
- `1000+`: Trên 1000 nhân viên

## Lưu ý

- API cập nhật thông tin công ty yêu cầu authentication
- API tạo, cập nhật, xóa đánh giá yêu cầu authentication
- API thống kê và báo cáo yêu cầu authentication
- Mỗi ứng viên chỉ có thể đánh giá một công ty một lần
- Thống kê bao gồm dữ liệu từ 6 tháng gần nhất
- Hệ thống tự động tính toán rating trung bình và phân bố rating
