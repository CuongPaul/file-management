# Tài liệu API

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Bắt đầu](#2-bắt-đầu)
   - [Lấy token](#21-lấy-token)
   - [Xác thực](#22-xác-thực)
3. [Endpoints](#3-endpoints)
   - [Upload file](#31-upload-file)
     - [Mô tả](#311-mô-tả)
     - [Request](#312-request)
     - [Response](#313-response)
   - [Di chuyển file](#32-di-chuyển-file)
     - [Mô tả](#321-mô-tả)
     - [Request](#322-request)
     - [Response](#323-response)
   - [Lấy thông tin file](#33-lấy-thông-tin-file)
     - [Mô tả](#331-mô-tả)
     - [Request](#332-request)
     - [Response](#333-response)
   - [Tìm kiếm file](#34-tìm-kiếm-file)
     - [Mô tả](#341-mô-tả)
     - [Request](#342-request)
     - [Response](#343-response)
   - [Xóa file](#35-xóa-file)
     - [Mô tả](#351-mô-tả)
     - [Request](#352-request)
     - [Response](#353-response)
   - [Lấy những file gốc](#36-lấy-những-file-gốc)
     - [Mô tả](#361-mô-tả)
     - [Request](#362-request)
     - [Response](#363-response)
   - [Preview file](#37-preview-file)
     - [Mô tả](#371-mô-tả)
     - [Request](#372-request)
     - [Response](#373-response)
4. [Lỗi](#4-lỗi)
5. [Ghi chú](#5-ghi-chú)

## 1. Giới thiệu

Gồm 7 APIs dùng để lấy những file gốc, tải lên, xem, cập nhật, lấy thông tin, tìm kiếm và xóa file.

## 2. Bắt đầu

### 2.1 Lấy token

Token được chia làm 2 loại access token (dùng để xác thực người dùng) và refresh token (dùng để cấp lại access token). Cả 2 loại này đều được lấy từ API đăng nhập.

### 2.2 Xác thực

Với những API yêu cầu xác thực thì ở headers của mỗi request gửi tới server cần gắn thêm trường Authorization. Giá trị của trường Authorization có định dạng **Bearer token**

## 3. Endpoints

### 3.1 Upload file

#### 3.1.1 Mô tả

API được dùng để tải file lên server

#### 3.1.2 Request

##### Method: `POST`

##### Endpoint: `/file`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (form-data):

```json
{
	"files_upload": "file", // File tải lên server
	"folder_id": "string" // Id của folder (không bắt buộc)
}
```

**Ví dụ Request:**

```http
POST /file
Host: api.example.com
Content-Type: multipart/form-data
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

Content-Disposition: form-data; name="folder_id"
Content-Type: text

Content-Disposition: form-data; name="files_upload"
Content-Type: file
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
	"data": "Array<{
		id: string,
		url: string,
		name: string,
		size: number,
		type: string,
		user_id: string,
		updated_at: string,
		created_at: string,
		folder_id: null | string
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
			"size": 400484,
			"folder_id": null,
			"type": "image/jpeg",
			"name": "born-to-shine",
			"url": "uploads/born-to-shine.jpg",
			"updated_at": "2023-12-22T08:24:41.013Z",
			"created_at": "2023-12-22T08:24:41.013Z",
			"id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
		}
	]
}
```

### 3.2 Di chuyển file

#### 3.2.1 Mô tả

API được dùng để di chuyển file tới folder mới

#### 3.2.2 Request

##### Method: `PATCH`

##### Endpoint: `/file/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"folder_id": "string" // Id của folder chứa file
}
```

**Ví dụ Request:**

```http
PATCH /file/22045850-e82f-4393-b3b0-b643df8bb3b8
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "folder_id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
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
		"url": "string",
		"name": "string",
		"size": "number",
		"type": "string",
		"user_id": "string",
		"folder_id": "string",
		"updated_at": "string",
		"created_at": "string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"size": 400484,
		"type": "image/jpeg",
		"name": "raise-your-hands",
		"url": "uploads/born-to-shine.jpg",
		"updated_at": "2023-12-22T08:24:41.013Z",
		"created_at": "2023-12-22T08:24:41.013Z",
		"id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"folder_id": "2acf3643-a3a2-46fb-9378-3289ae326ab1"
	}
}
```

### 3.3 Lấy thông tin file

#### 3.3.1 Mô tả

API được dùng để lấy thông tin file

#### 3.3.2 Request

##### Method: `GET`

##### Endpoint: `/file/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /file/2acf3643-a3a2-46fb-9378-3289ae326ab1
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
		"url": "string",
		"name": "string",
		"size": "number",
		"type": "string",
		"user_id": "string",
		"updated_at": "string",
		"created_at": "string",
		"folder_id": "null | string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"size": 400484,
		"folder_id": null,
		"type": "image/jpeg",
		"name": "raise-your-hands",
		"url": "uploads/born-to-shine.jpg",
		"updated_at": "2023-12-22T08:24:41.013Z",
		"created_at": "2023-12-22T08:24:41.013Z",
		"id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
	}
}
```

### 3.4 Tìm kiếm file

#### 3.4.1 Mô tả

API được dùng để lấy ra những file thỏa mãn điều kiện tìm kiếm

#### 3.4.2 Request

##### Method: `GET`

##### Endpoint: `/file`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

- **name:** (string) Tên file (không bắt buộc nếu type có giá trị)
- **type:** (string) Loại của file (không bắt buộc nếu name có giá trị)

##### Body (JSON):

**Ví dụ Request:**

```http
GET /file?name=raise-your-hands
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
		url: string,
		name: string,
		size: number,
		type: string,
		user_id: string,
		updated_at: string,
		created_at: string,
		folder_id: null | string
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
			"size": 400484,
			"folder_id": null,
			"type": "image/jpeg",
			"name": "raise-your-hands",
			"url": "uploads/born-to-shine.jpg",
			"updated_at": "2023-12-22T08:24:41.013Z",
			"created_at": "2023-12-22T08:24:41.013Z",
			"id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
		}
	]
}
```

### 3.5 Xóa file

#### 3.5.1 Mô tả

API được dùng xóa file

#### 3.5.2 Request

##### Method: `DELETE`

##### Endpoint: `/file/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
DELETE /file/2acf3643-a3a2-46fb-9378-3289ae326ab1
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

### 3.6 Lấy những file gốc

#### 3.6.1 Mô tả

API được dùng để lấy ra những file gốc (file mà không nằm trong folder nào)

#### 3.6.2 Request

##### Method: `GET`

##### Endpoint: `/file/root`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /file/root
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.6.3 Response

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
		url: string,
		name: string,
		size: number,
		type: string,
		folder_id: null,
		user_id: string,
		updated_at: string,
		created_at: string
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
			"size": 400484,
			"folder_id": null,
			"type": "image/jpeg",
			"name": "raise-your-hands",
			"url": "uploads/born-to-shine.jpg",
			"updated_at": "2023-12-22T08:24:41.013Z",
			"created_at": "2023-12-22T08:24:41.013Z",
			"id": "2acf3643-a3a2-46fb-9378-3289ae326ab1",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
		}
	]
}
```

### 3.7 Preview file

#### 3.7.1 Mô tả

API được dùng để xem file

#### 3.7.2 Request

##### Method: `GET`

##### Endpoint: `/file/preview`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

- **name:** (string) Tên file

##### Body (JSON):

**Ví dụ Request:**

```http
GET /file/preview?name=update.png
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
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
