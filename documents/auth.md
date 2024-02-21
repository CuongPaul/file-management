# Tài liệu API

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Bắt đầu](#2-bắt-đầu)
   - [Lấy token](#21-lấy-token)
   - [Xác thực](#22-xác-thực)
3. [Endpoints](#3-endpoints)
   - [Đăng ký](#31-đăng-ký)
     - [Mô tả](#311-mô-tả)
     - [Request](#312-request)
     - [Response](#313-response)
   - [Đăng nhập](#32-đăng-nhập)
     - [Mô tả](#321-mô-tả)
     - [Request](#322-request)
     - [Response](#323-response)
   - [Đăng xuất](#33-đăng-xuất)
     - [Mô tả](#331-mô-tả)
     - [Request](#332-request)
     - [Response](#333-response)
   - [Làm mới access token](#34-làm-mới-access-token)
     - [Mô tả](#341-mô-tả)
     - [Request](#342-request)
     - [Response](#343-response)
4. [Lỗi](#4-lỗi)
5. [Ghi chú](#5-ghi-chú)

## 1. Giới thiệu

Gồm 4 APIs dùng để đăng ký, đăng nhập, đăng xuất và làm mới access token.

## 2. Bắt đầu

### 2.1 Lấy token

Token được chia làm 2 loại access token (dùng để xác thực người dùng) và refresh token (dùng để cấp lại access token). Cả 2 loại này đều được lấy từ API [đăng nhập](#32-đăng-nhập).

### 2.2 Xác thực

Với những API yêu cầu xác thực thì ở headers của mỗi request gửi tới server cần gắn thêm trường Authorization. Giá trị của trường Authorization có định dạng **Bearer token**

## 3. Endpoints

### 3.1 Đăng ký

#### 3.1.1 Mô tả

API được dùng để tạo tài khoản

#### 3.1.2 Request

##### Method: `POST`

##### Endpoint: `/auth/sign-up`

##### Headers:

##### Parameters (query string):

##### Body (JSON):

```json
{
	"email": "string", // Email người dùng
	"username": "string", // Tên tài khoản
	"password": "string" // Mật khẩu cho tài khoản
}
```

**Ví dụ Request:**

```http
POST /auth/sign-up
Host: api.example.com

{
    "username": "Ta Cuong - 1",
    "email": "cuongvt1@gmail.com",
    "password": "gqaUI-3XzIo_JY%"
}
```

### 3.1.3 Response

##### Headers:

- **Status Code:** 201 Created
- **Content-Type:** `application/json`

##### Body (JSON):

```json
{
	"message": "string",
	"statusCode": "number",
	"data": {
		"id": "string",
		"email": "string",
		"username": "string",
		"created_at": "string",
		"updated_at": "string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"username": "Ta Cuong - 1",
		"email": "cuongvt1@gmail.com",
		"created_at": "2023-12-26T07:04:22.694Z",
		"updated_at": "2023-12-26T07:04:22.694Z",
		"id": "a9b6ae8b-b599-4a44-a626-fb660ae6e3ec"
	}
}
```

### 3.2 Đăng nhập

#### 3.2.1 Mô tả

API được dùng để đăng nhập vào hệ thống

#### 3.2.2 Request

##### Method: `PATCH`

##### Endpoint: `/auth/sign-in`

##### Headers:

##### Parameters (query string):

##### Body (JSON):

```json
{
	"email": "string", // Email người dùng
	"password": "string" // Mật khẩu cho tài khoản
}
```

**Ví dụ Request:**

```http
PATCH /auth/sign-in
Host: api.example.com

{
    "username": "Ta Cuong - 1",
    "password": "gqaUI-3XzIo_JY%"
}
```

### 3.2.3 Response

##### Headers:

- **Status Code:** 200 OK
- **Content-Type:** `application/json`

##### Body (JSON):

```json
{
	"message": "string",
	"statusCode": "number",
	"data": {
		"access_token": "string",
		"refresh_token": "string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI",
		"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.2AnNOe-y49vZd5o7sq7kwyfp8elDbQR5AxF4RfRZiK8"
	}
}
```

### 3.3 Đăng xuất

#### 3.3.1 Mô tả

API được dùng để đăng xuất khỏi hệ thống

#### 3.3.2 Request

##### Method: `PATCH`

##### Endpoint: `/auth/sign-out`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
PATCH /auth/sign-out
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.3.3 Response

##### Headers:

- **Status Code:** 200 OK
- **Content-Type:** `application/json`

##### Body (JSON):

```json
{
	"message": "string",
	"statusCode": "number"
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success"
}
```

### 3.4 Làm mới access token

#### 3.4.1 Mô tả

API được dùng để lấy access token mới

#### 3.4.2 Request

##### Method: `GET`

##### Endpoint: `/auth/refresh-access-token`

##### Headers:

- **Authorization:** `Bearer REFRESH_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /auth/refresh-access-token
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.4.3 Response

##### Headers:

- **Status Code:** 200 OK
- **Content-Type:** `application/json`

##### Body (JSON):

```json
{
	"data": "string",
	"message": "string",
	"statusCode": "number"
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMWJjNTYxODktZGVhNi00NTEzLThkNjItZGJjMDM2ODNiNGQ2IiwiaWF0IjoxNzAzMjI3NTEwLCJleHAiOjE3MDM4MzIzMTB9.sx-TOcqiDJE5FnL4qAjtp_965eT4YKvK-Yuc4yg3OzU"
}
```

## 4. Lỗi

- **Mã lỗi 400 - Bad Request:**

  - **Ý nghĩa:** Yêu cầu không hợp lệ, có thể do dữ liệu đầu vào không đúng định dạng hoặc thiếu thông tin cần thiết.

- **Mã lỗi 401 - Unauthorized:**

  - **Ý nghĩa:** Người dùng chưa được xác thực hoặc không có quyền truy cập tài nguyên.

- **Mã lỗi 403 - Forbidden:**

  - **Ý nghĩa:** Người dùng đã được xác thực, nhưng không có quyền truy cập tài nguyên cụ thể.

- **Mã lỗi 404 - Not Found:**

  - **Ý nghĩa:** Tài nguyên không được tìm thấy.

- **Mã lỗi 500 - Internal Server Error:**

  - **Ý nghĩa:** Lỗi nội bộ của máy chủ, có thể là do bug trong hệ thống.

- **Mã lỗi 503 - Service Unavailable:**
  - **Ý nghĩa:** Dịch vụ không khả dụng, có thể do bảo trì hoặc tải nặng.

## 5. Ghi chú

Không
