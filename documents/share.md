# Tài liệu API

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Bắt đầu](#2-bắt-đầu)
   - [Lấy token](#21-lấy-token)
   - [Xác thực](#22-xác-thực)
3. [Endpoints](#3-endpoints)
   - [Tạo share](#31-tạo-share)
     - [Mô tả](#311-mô-tả)
     - [Request](#312-request)
     - [Response](#313-response)
   - [Cập nhật thông tin share](#32-cập-nhật-thông-tin-share)
     - [Mô tả](#321-mô-tả)
     - [Request](#322-request)
     - [Response](#323-response)
   - [Lấy thông tin share](#33-lấy-thông-tin-share)
     - [Mô tả](#331-mô-tả)
     - [Request](#332-request)
     - [Response](#333-response)
   - [Tìm kiếm share](#34-tìm-kiếm-share)
     - [Mô tả](#341-mô-tả)
     - [Request](#342-request)
     - [Response](#343-response)
   - [Xóa share](#35-xóa-share)
     - [Mô tả](#351-mô-tả)
     - [Request](#352-request)
     - [Response](#353-response)
4. [Lỗi](#4-lỗi)
5. [Ghi chú](#5-ghi-chú)

## 1. Giới thiệu

Gồm 5 APIs dùng để tạo, cập nhật, lấy thông tin, tìm kiếm và xóa share.

## 2. Bắt đầu

### 2.1 Lấy token

Token được chia làm 2 loại access token (dùng để xác thực người dùng) và refresh token (dùng để cấp lại access token). Cả 2 loại này đều được lấy từ API đăng nhập.

### 2.2 Xác thực

Với những API yêu cầu xác thực thì ở headers của mỗi request gửi tới server cần gắn thêm trường Authorization. Giá trị của trường Authorization có định dạng **Bearer token**

## 3. Endpoints

### 3.1 Tạo share

#### 3.1.1 Mô tả

API được dùng để tạo chia sẻ, cho phép người được chia sẻ thao thác với file hoặc folder với các quyền đã được cho phép

#### 3.1.2 Request

##### Method: `POST`

##### Endpoint: `/share`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"consumer_id": "string", // Id của người được chia sẻ
	"file_id": "string", // Id của file được chia sẻ (không bắt buộc)
	"folder_id": "string", // Id của folder được chia sẻ (không bắt buộc)
	"permissions": "<READ | CREATE | DELETE | UPDATE>[]" // Các quyền mà người được chia sẻ được phép thao tác với file/folder
}
```

**Ví dụ Request:**

```http
POST /share
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
	"permissions": ["READ", "CREATE"],
	"folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70",
	"consumer_id": "c996ae91-865e-46ef-b0a7-886ec1047a16"
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
		"user_id": "string",
		"folder_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"consumer_id": "string",
		"file_id": "null | string",
		"permissions": "<READ | CREATE | DELETE | UPDATE>[]"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"file_id": null,
		"permissions": ["READ", "CREATE"],
		"updated_at": "2023-12-22T08:53:29.550Z",
		"created_at": "2023-12-22T08:53:29.550Z",
		"id": "47a0587a-85e1-4287-9665-8d71880a508b",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70",
		"consumer_id": "c996ae91-865e-46ef-b0a7-886ec1047a16"
	}
}
```

### 3.2 Cập nhật thông tin share

#### 3.2.1 Mô tả

API được dùng để cập nhật thông tin share

#### 3.2.2 Request

##### Method: `PATCH`

##### Endpoint: `/share/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"permissions": "<READ | CREATE | DELETE | UPDATE>[]" // Các quyền mà người được chia sẻ được phép thao tác với file/folder
}
```

**Ví dụ Request:**

```http
PATCH /share/47a0587a-85e1-4287-9665-8d71880a508b
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "permissions": ["DELETE", "UPDATE"]
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
		"user_id": "string",
		"folder_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"consumer_id": "string",
		"file_id": "null | string",
		"permissions": "<READ | CREATE | DELETE | UPDATE>[]"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"file_id": null,
		"permissions": ["DELETE", "UPDATE"],
		"updated_at": "2023-12-22T08:53:29.550Z",
		"created_at": "2023-12-22T08:53:29.550Z",
		"id": "47a0587a-85e1-4287-9665-8d71880a508b",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70",
		"consumer_id": "c996ae91-865e-46ef-b0a7-886ec1047a16"
	}
}
```

### 3.3 Lấy thông tin share

#### 3.3.1 Mô tả

API được dùng để lấy thông tin share

#### 3.3.2 Request

##### Method: `GET`

##### Endpoint: `/share/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /share/47a0587a-85e1-4287-9665-8d71880a508b
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
	"data": {
		"id": "string",
		"user_id": "string",
		"folder_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"consumer_id": "string",
		"file_id": "null | string",
		"permissions": "<READ | CREATE | DELETE | UPDATE>[]"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"file_id": null,
		"permissions": ["DELETE", "UPDATE"],
		"updated_at": "2023-12-22T08:53:29.550Z",
		"created_at": "2023-12-22T08:53:29.550Z",
		"id": "47a0587a-85e1-4287-9665-8d71880a508b",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70",
		"consumer_id": "c996ae91-865e-46ef-b0a7-886ec1047a16"
	}
}
```

### 3.4 Tìm kiếm share

#### 3.4.1 Mô tả

API được dùng để lấy ra những share thỏa mãn điều kiện tìm kiếm

#### 3.4.2 Request

##### Method: `GET`

##### Endpoint: `/share`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

- **file_id:** (string) Id của file được chia sẻ (không bắt buộc)
- **folder_id:** (string) Id của folder được chia sẻ (không bắt buộc)
- **consumer_id:** (string) Id của người được chia sẻ (không bắt buộc)
- **permissions:** (string) Các quyền mà người được chia sẻ được phép thao tác với file/folder

##### Body (JSON):

**Ví dụ Request:**

```http
GET /share?folder_id=0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70
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
	"message": "string",
	"statusCode": "number",
	"data": "Array<{
		id: string,
		user_id: string,
		folder_id: string,
		created_at: string,
		updated_at: string,
		consumer_id: string,
		file_id: null | string,
		permissions: <READ | CREATE | DELETE | UPDATE>[]
	}>",
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": [
		{
			"file_id": null,
			"permissions": ["DELETE", "UPDATE"],
			"updated_at": "2023-12-22T08:53:29.550Z",
			"created_at": "2023-12-22T08:53:29.550Z",
			"id": "47a0587a-85e1-4287-9665-8d71880a508b",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
			"folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70",
			"consumer_id": "c996ae91-865e-46ef-b0a7-886ec1047a16"
		}
	]
}
```

### 3.5 Xóa share

#### 3.5.1 Mô tả

API được dùng xóa share

#### 3.5.2 Request

##### Method: `DELETE`

##### Endpoint: `/share`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
DELETE /share
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.5.3 Response

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
