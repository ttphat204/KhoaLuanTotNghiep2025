# Authentication API Documentation

## Tổng quan

AuthController cung cấp các API để quản lý xác thực người dùng, bao gồm đăng ký, đăng nhập, đăng xuất và quản lý mật khẩu cho cả nhà tuyển dụng và ứng viên.

## Base URL

```
/api/auth
```

## Authentication

Hầu hết các API endpoints không yêu cầu authentication, trừ khi được chỉ định.

## API Endpoints

### 1. Đăng ký tài khoản nhà tuyển dụng

**POST** `/register/employer`

**Request Body:**

```json
{
  "email": "employer@company.com",
  "password": "password123",
  "companyName": "Tên công ty",
  "phone": "0123456789",
  "address": "Địa chỉ công ty"
}
```

**Response:**

```json
{
  "message": "Đăng ký nhà tuyển dụng thành công"
}
```

### 2. Đăng ký tài khoản ứng viên

**POST** `/register/candidate`

**Request Body:**

```json
{
  "phone": "0123456789",
  "password": "password123",
  "fullName": "Tên ứng viên",
  "email": "candidate@email.com",
  "address": "Địa chỉ ứng viên"
}
```

**Response:**

```json
{
  "message": "Đăng ký ứng viên thành công"
}
```

### 3. Đăng nhập

**POST** `/login`

**Request Body:**

```json
{
  "email": "employer@company.com",
  "password": "password123",
  "role": "employer"
}
```

**Hoặc cho ứng viên:**

```json
{
  "phone": "0123456789",
  "password": "password123",
  "role": "candidate"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "employer@company.com",
    "phone": "0123456789",
    "role": "employer",
    "fullName": "Tên người dùng",
    "companyName": "Tên công ty"
  }
}
```

### 4. Đăng xuất

**POST** `/logout`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "message": "Đăng xuất thành công"
}
```

### 5. Quên mật khẩu

**POST** `/forgot-password`

**Request Body:**

```json
{
  "email": "employer@company.com",
  "role": "employer"
}
```

**Hoặc cho ứng viên:**

```json
{
  "phone": "0123456789",
  "role": "candidate"
}
```

**Response:**

```json
{
  "message": "Email đặt lại mật khẩu đã được gửi"
}
```

### 6. Đặt lại mật khẩu

**POST** `/reset-password`

**Request Body:**

```json
{
  "token": "reset_token_here",
  "password": "new_password123"
}
```

**Response:**

```json
{
  "message": "Đặt lại mật khẩu thành công"
}
```

### 7. Xác thực token

**GET** `/verify`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Response:**

```json
{
  "valid": true,
  "user": {
    "id": "user_id",
    "email": "employer@company.com",
    "role": "employer"
  }
}
```

### 8. Đổi mật khẩu

**POST** `/change-password`

**Headers:**

```
Authorization: Bearer jwt_token_here
```

**Request Body:**

```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password123"
}
```

**Response:**

```json
{
  "message": "Đổi mật khẩu thành công"
}
```

## Vai trò người dùng

- `employer`: Nhà tuyển dụng
- `candidate`: Ứng viên

## Phương thức đăng nhập

- **Nhà tuyển dụng**: Đăng nhập bằng email
- **Ứng viên**: Đăng nhập bằng số điện thoại

## JWT Token

- Token có thời hạn 24 giờ
- Chứa thông tin: userId, role, email, phone
- Sử dụng cho các API yêu cầu authentication

## Quản lý mật khẩu

- Mật khẩu được mã hóa bằng bcrypt
- Token đặt lại mật khẩu có thời hạn 1 giờ
- Gửi email đặt lại mật khẩu tự động

## Lưu ý

- Email và số điện thoại phải là duy nhất
- Mật khẩu tối thiểu 6 ký tự
- Tài khoản có trạng thái active/inactive
- JWT token được lưu ở client side
