# Tài liệu API

## Mục lục

1. [Giới thiệu](#1-giới-thiệu)
2. [Bắt đầu](#2-bắt-đầu)
   - [Lấy token](#21-lấy-token)
   - [Xác thực](#22-xác-thực)
3. [Endpoints](#3-endpoints)
   - [Tạo folder](#31-tạo-folder)
     - [Mô tả](#311-mô-tả)
     - [Request](#312-request)
     - [Response](#313-response)
   - [Cập nhật thông tin folder](#32-cập-nhật-thông-tin-folder)
     - [Mô tả](#321-mô-tả)
     - [Request](#322-request)
     - [Response](#323-response)
   - [Lấy thông tin folder](#33-lấy-thông-tin-folder)
     - [Mô tả](#331-mô-tả)
     - [Request](#332-request)
     - [Response](#333-response)
   - [Tìm kiếm folder](#34-tìm-kiếm-folder)
     - [Mô tả](#341-mô-tả)
     - [Request](#342-request)
     - [Response](#343-response)
   - [Xóa folder](#35-xóa-folder)
     - [Mô tả](#351-mô-tả)
     - [Request](#352-request)
     - [Response](#353-response)
   - [Lấy những folder gốc](#36-lấy-những-folder-gốc)
     - [Mô tả](#361-mô-tả)
     - [Request](#362-request)
     - [Response](#363-response)
   - [Cây thư mục](#37-cây-thư-mục)
     - [Mô tả](#371-mô-tả)
     - [Request](#372-request)
     - [Response](#373-response)
   - [Lấy file và folder con](#38-lấy-file-và-folder-con)
     - [Mô tả](#381-mô-tả)
     - [Request](#382-request)
     - [Response](#383-response)
   - [Chuyển đến folder khác](#39-chuyển-đến-folder-khác)
     - [Mô tả](#391-mô-tả)
     - [Request](#392-request)
     - [Response](#393-response)
4. [Lỗi](#4-lỗi)
5. [Ghi chú](#5-ghi-chú)

## 1. Giới thiệu

Gồm 9 APIs dùng để chuyển 1 folder đến folder khác, lấy file và folder con, cây thư mục, lấy những folder gốc, tạo, cập nhật, lấy thông tin, tìm kiếm và xóa folder.

## 2. Bắt đầu

### 2.1 Lấy token

Token được chia làm 2 loại access token (dùng để xác thực người dùng) và refresh token (dùng để cấp lại access token). Cả 2 loại này đều được lấy từ API đăng nhập.

### 2.2 Xác thực

Với những API yêu cầu xác thực thì ở headers của mỗi request gửi tới server cần gắn thêm trường Authorization. Giá trị của trường Authorization có định dạng **Bearer token**

## 3. Endpoints

### 3.1 Tạo folder

#### 3.1.1 Mô tả

API được dùng để tạo folder

#### 3.1.2 Request

##### Method: `POST`

##### Endpoint: `/folder`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"name": "string", // Tên folder
	"parent_folder_id": "string" // Id của folder cha (không bắt buộc)
}
```

**Ví dụ Request:**

```http
POST /folder
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "name": "F-0001"
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
		"name": "string",
		"user_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"parent_folder_id": "null | string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"name": "F-0001",
		"parent_folder_id": null,
		"updated_at": "2023-12-22T07:30:55.286Z",
		"created_at": "2023-12-22T07:30:55.286Z",
		"id": "22045850-e82f-4393-b3b0-b643df8bb3b8",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
	}
}
```

### 3.2 Cập nhật thông tin folder

#### 3.2.1 Mô tả

API được dùng để cập nhật thông tin folder

#### 3.2.2 Request

##### Method: `PATCH`

##### Endpoint: `/folder/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"name": "string" // Tên folder
}
```

**Ví dụ Request:**

```http
PATCH /folder/22045850-e82f-4393-b3b0-b643df8bb3b8
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "name": "F - 0000"
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
		"name": "string",
		"user_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"parent_folder_id": "null | string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"name": "F-0000",
		"created_at": "2023-12-22T07:30:55.286Z",
		"updated_at": "2023-12-22T07:42:04.252Z",
		"id": "22045850-e82f-4393-b3b0-b643df8bb3b8",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"parent_folder_id": "9326f65a-d482-468e-9f0b-7f5298871b2a"
	}
}
```

### 3.3 Lấy thông tin folder

#### 3.3.1 Mô tả

API được dùng để lấy thông tin folder

#### 3.3.2 Request

##### Method: `GET`

##### Endpoint: `/folder/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /folder/22045850-e82f-4393-b3b0-b643df8bb3b8
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
		"name": "string",
		"user_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"parent_folder_id": "null | string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"name": "F-0000",
		"created_at": "2023-12-22T07:30:55.286Z",
		"updated_at": "2023-12-22T07:42:04.252Z",
		"id": "22045850-e82f-4393-b3b0-b643df8bb3b8",
		"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
		"parent_folder_id": "9326f65a-d482-468e-9f0b-7f5298871b2a"
	}
}
```

### 3.4 Tìm kiếm folder

#### 3.4.1 Mô tả

API được dùng để lấy ra những folder thỏa mãn điều kiện tìm kiếm

#### 3.4.2 Request

##### Method: `GET`

##### Endpoint: `/folder`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

- **name:** (string) Tên folder

##### Body (JSON):

**Ví dụ Request:**

```http
GET /folder?name=F-0000
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
		name: string,
		user_id: string,
		created_at: string,
		updated_at: string,
		parent_folder_id: null | string
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
			"name": "F-0001",
			"created_at": "2023-12-22T07:30:55.286Z",
			"updated_at": "2023-12-22T07:42:04.252Z",
			"id": "22045850-e82f-4393-b3b0-b643df8bb3b8",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6",
			"parent_folder_id": "0e488ee6-e7fc-4ec9-9bbd-d9c1c320dd70"
		}
	]
}
```

### 3.5 Xóa folder

#### 3.5.1 Mô tả

API được dùng xóa folder

#### 3.5.2 Request

##### Method: `DELETE`

##### Endpoint: `/folder/:id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
DELETE /folder/88a0b39e-659b-4b2d-84c5-09dfbcc81319
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

### 3.6 Lấy những folder gốc

#### 3.6.1 Mô tả

API được dùng để lấy ra những folder gốc (folder mà không nằm trong folder nào)

#### 3.6.2 Request

##### Method: `GET`

##### Endpoint: `/folder/root`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /folder/root
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
		name: string,
		user_id: string,
		created_at: string,
		updated_at: string,
		parent_folder_id: null
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
			"name": "F-0001",
			"parent_folder_id": null,
			"created_at": "2023-12-22T07:30:55.286Z",
			"updated_at": "2023-12-22T07:42:04.252Z",
			"id": "22045850-e82f-4393-b3b0-b643df8bb3b8",
			"user_id": "1bc56189-dea6-4513-8d62-dbc03683b4d6"
		}
	]
}
```

### 3.7 Cây thư mục

#### 3.7.1 Mô tả

API được dùng để lấy ra cây thư mục

#### 3.7.2 Request

##### Method: `GET`

##### Endpoint: `/folder/tree`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /folder/tree
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.7.3 Response

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
		name: string,
		parent_folder_id: null | string,
		children: Array<{
			id: string,
			name: string,
			parent_folder_id: null | string,
			children: Array<{
				id: string,
				name: string,
				parent_folder_id: null | string,
				children: ...
			}>
		}>
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
			"id": "fcd80f32-6031-4be0-ae45-5dfea1fbe668",
			"name": "F-0001",
			"parent_folder_id": null,
			"children": [
				{
					"id": "fcd80f32-6031-4be0-ae45-5dfea1fbe669",
					"name": "F-0011",
					"parent_folder_id": "fcd80f32-6031-4be0-ae45-5dfea1fbe668",
					"children": [
						{
							"id": "fcd80f32-6031-4be0-ae45-5dfea1fbe660",
							"name": "F-0111",
							"parent_folder_id": "fcd80f32-6031-4be0-ae45-5dfea1fbe669",
							"children": []
						}
					]
				}
			]
		}
	]
}
```

### 3.8 Lấy file và folder con

#### 3.8.1 Mô tả

API được dùng để lấy file và folder con

#### 3.8.2 Request

##### Method: `GET`

##### Endpoint: `/folder/inside/:parent_folder_id`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

**Ví dụ Request:**

```http
GET /folder/inside/fcd80f32-6031-4be0-ae45-5dfea1fbe668
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI
```

### 3.8.3 Response

##### Headers:

- **Status Code:** 200 OK
- **Content-Type:** `application/json`

##### Body (JSON):

```json
{
	"message": "string",
	"statusCode": "number",
	"data": "{
		files: Array<{
			id: string,
			url: string,
			name: string,
			size: number,
			type: string,
			user_id: string,
			folder_id: string,
			created_at: string,
			updated_at: string,
		}>
		folders: Array<{
			id: string,
			name: string,
			user_id: string,
			created_at: string,
			updated_at: string,
			parent_folder_id: string,
		}>
	}",
}
```

### 3.9 Chuyển đến folder khác

#### 3.9.1 Mô tả

API được dùng để chuyển vị trí của folder sang folder khác

#### 3.9.2 Request

##### Method: `PATCH`

##### Endpoint: `/folder/move-to-folder`

##### Headers:

- **Authorization:** `Bearer ACCESS_TOKEN`

##### Parameters (query string):

##### Body (JSON):

```json
{
	"id": "string",
	"parent_folder_id": "string"
}
```

**Ví dụ Request:**

```http
PATCH /folder/move-to-folder
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjE5YWZhMDEtOWQzYi00NjBkLWExYWMtMzJmZTBmYWUyNDllIiwiaWF0IjoxNzAzMjE4MTI2LCJleHAiOjE3MDM4MjI5MjZ9.uG29a8oEbKP-Sk66XG8r9mSm8bTIDSnYJw-Uc7U_OUI

{
    "id": "c5e3e565-e22a-4c69-982f-9dde4b923ac3",
    "parent_folder_id": "fcd80f32-6031-4be0-ae45-5dfea1fbe668"
}
```

### 3.9.3 Response

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
		"name": "string",
		"user_id": "string",
		"created_at": "string",
		"updated_at": "string",
		"parent_folder_id": "null | string"
	}
}
```

**Ví dụ Response:**

```json
{
	"statusCode": 0,
	"message": "success",
	"data": {
		"name": "F-0002",
		"created_at": "2023-12-26T13:21:59.585Z",
		"updated_at": "2023-12-26T13:58:31.962Z",
		"id": "c5e3e565-e22a-4c69-982f-9dde4b923ac3",
		"user_id": "b4ff5821-9d89-4c0d-ad47-e2cf57e16595",
		"parent_folder_id": "fcd80f32-6031-4be0-ae45-5dfea1fbe668"
	}
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
