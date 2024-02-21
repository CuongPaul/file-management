# Tài liệu API

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Bắt đầu](#2-bắt-đầu)
   - [Lấy token](#21-lấy-token)
   - [Xác thực](#22-xác-thực)
3. [Endpoints](#3-endpoints)
   - [Lấy thông tin người dùng](#31-lấy-thông-tin-người-dùng)
     - [Mô tả](#311-mô-tả)
     - [Request](#312-request)
     - [Response](#313-response)
   - [Cập nhật thông tin người dùng](#32-cập-nhật-thông-tin-người-dùng)
     - [Mô tả](#321-mô-tả)
     - [Request](#322-request)
     - [Response](#323-response)
   - [Tìm kiếm người dùng](#33-tìm-kiếm-người-dùng)
     - [Mô tả](#331-mô-tả)
     - [Request](#332-request)
     - [Response](#333-response)
4. [Lỗi](#4-lỗi)
5. [Ghi chú](#5-ghi-chú)

## 1. Giới thiệu

Gồm 3 APIs dùng để tìm kiếm người dùng, lấy và cập nhật thông tin người dùng.

## 2. Bắt đầu

### 2.1 Lấy token

Token được chia làm 2 loại access token (dùng để xác thực người dùng) và refresh token (dùng để cấp lại access token). Cả 2 loại này đều được lấy từ API đăng nhập.

### 2.2 Xác thực

Với những API yêu cầu xác thực thì ở headers của mỗi request gửi tới server cần gắn thêm trường Authorization. Giá trị của trường Authorization có định dạng **Bearer token**

## 3. Endpoints

### 3.1 Lấy thông tin người dùng

#### 3.1.1 Mô tả

API được dùng để lấy thông tin người dùng

#### 3.1.2 Request

##### Method: `GET`

##### Endpoint: `/user/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /user/1bc56189-dea6-4513-8d62-dbc03683b4d6
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.1.3 Response

##### Headers:

- **Status Code:** 200 OK
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
		"created_at": "2023-12-21T08:43:05.259Z",
		"updated_at": "2023-12-26T02:31:34.174Z",
		"id": "a9b6ae8b-b599-4a44-a626-fb660ae6e3ec"
	}
}
```

### 3.2 Cập nhật thông tin người dùng

#### 3.2.1 Mô tả

API được dùng để cập nhật thông tin người dùng

#### 3.2.2 Request

##### Method: `PATCH`

##### Endpoint: `/user`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"username": "string" // Tên người dùng
}
```

**Ví dụ Request:**

```http
PATCH /user
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "username": "Cuong VT"
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
		"username": "Cuong VT",
		"email": "cuongvt1@gmail.com",
		"created_at": "2023-12-26T08:21:01.192Z",
		"updated_at": "2023-12-26T08:28:39.454Z",
		"id": "a9b6ae8b-b599-4a44-a626-fb660ae6e3ec"
	}
}
```

### 3.3 Tìm kiếm người dùng

#### 3.3.1 Mô tả

API được dùng để tìm kiếm người dùng. Trả về danh sách người dùng theo điều kiện tìm kiếm, loại trừ người đang tìm kiếm.

#### 3.3.2 Request

##### Method: `GET`

##### Endpoint: `/user`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

- **username:** (string) Tên người dùng (không bắt buộc nếu email có giá trị)
- **email:** (string) Email của người dùng (không bắt buộc nếu username có giá trị)

##### Body (JSON):

**Ví dụ Request:**

```http
GET /user?username=Ta Cuong&email=cuongvt
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
	"statusCode": "number",
	"data": "Array<{
		id: string,
		email: string,
		username: string,
		created_at: string,
		updated_at: string
	}>"
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": [
		{
			"username": "Ta Cuong - 2",
			"email": "cuongvt2@gmail.com",
			"created_at": "2023-12-19T00:00:00.000Z",
			"updated_at": "2023-12-19T00:00:00.000Z",
			"id": "b4ff5821-9d89-4c0d-ad47-e2cf57e16596"
		},
		{
			"username": "Ta Cuong - 3",
			"email": "cuongvt3@gmail.com",
			"created_at": "2023-12-19T00:00:00.000Z",
			"updated_at": "2023-12-19T00:00:00.000Z",
			"id": "b4ff5821-9d89-4c0d-ad47-e2cf57e16597"
		}
	]
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
