# Next-Nest E-commerce — README

## Giới thiệu Dự án

**Next-Nest E-commerce** là một dự án thương mại điện tử solo được xây dựng bằng bộ đôi:

- **Next.js 14 (App Router)**
- **NestJS (REST API + MongoDB)**
  Kết hợp với **Ant Design** để xây dựng UI nhanh, đẹp, module hoá.

Dự án hướng đến việc xây dựng một hệ thống eCommerce hoàn chỉnh, từ FE đến BE, bao gồm:

- Website bán hàng
- Hệ thống thanh toán trực tuyến (VNPAY Sandbox)
- Hệ thống đánh giá & bình luận
- Hệ thống voucher giảm giá thông minh
- Trang chi tiết bài viết: _2 Magazine_ & _1 Exclusive Side_
- Admin Dashboard đầy đủ module quản lý

---

## ✨ Tính năng nổi bật

### 🔐 1. Hệ thống Authentication hoàn chỉnh

- Đăng ký / Đăng nhập qua email + mật khẩu
- **Google OAuth 2.0**
- Xác thực JWT (access + refresh token)
- Hệ thống Email Service:
  - Gửi email xác thực đăng ký
  - Gửi email quên mật khẩu
  - Gửi OTP

---

### 🛍️ 2. Giao diện sản phẩm chuyên nghiệp

- Lọc theo danh mục, thương hiệu, giá
- Tìm kiếm theo tên sản phẩm (search realtime)
- Sắp xếp theo giá, lượt bán, đánh giá
- Trang chi tiết sản phẩm có slider ảnh, thumbnail

---

### ⭐ 3. Rating & Comment System

- Đánh giá sản phẩm theo số sao
- Bình luận có user, thời gian
- Trả lời bình luận
- Chặn spam, giới hạn thời gian comment

---

### 💵 4. Thanh toán trực tuyến (VNPAY Sandbox)

- Tạo đơn hàng thanh toán VNPay
- Tự động xác thực callback
- Cập nhật trạng thái đơn & tồn kho
- Hỗ trợ thanh toán:
  - COD
  - MOMO (upcoming)
  - BANK
  - VNPAY

---

### 🎫 5. Hệ thống Voucher thông minh

- Hỗ trợ giảm % hoặc số tiền cố định
- Điều kiện áp dụng theo:
  - Danh mục
  - Sản phẩm
  - Thương hiệu
  - Người dùng
- Giới hạn lượt dùng
- Ngày bắt đầu — kết thúc

---

### 📰 6. Hệ thống bài viết (Magazine + Exclusive)

- 2 Magazine
- 1 Exclusive Side
- Giao diện SEO đẹp
- Rich content (ảnh + code + video)

---

### 🛠️ 7. Hệ thống Admin Dashboard hoàn chỉnh

Admin gồm các module:

| Module              | Mô tả                                     |
| ------------------- | ----------------------------------------- |
| **Dashboard**       | Tổng quan doanh thu, đơn hàng, người dùng |
| **User Manager**    | CRUD User, phân quyền                     |
| **Product Manager** | CRUD Sản phẩm, upload thumbnail & slider  |
| **Order Manager**   | Duyệt đơn, quản lý trạng thái & tồn kho   |
| **Rating Manager**  | Quản lý đánh giá sản phẩm                 |
| **Voucher Manager** | Tạo & kiểm soát mã giảm giá               |
| **Comment Manager** | Quản lý bình luận                         |

---

## 🏗️ Công nghệ sử dụng

### Frontend (Next.js)

- Next.js 14 (App Router)
- React 18
- Ant Design
- TailwindCSS (optional)

### Backend (NestJS)

- NestJS
- MongoDB + Mongoose
- Soft Delete Plugin
- Multer (upload ảnh)
- JWT Auth
- Google OAuth2
- VNPay Service

---

## 📁 Cấu trúc dự án (overview)

### Frontend

```
/src
 ├─ app
 ├─ components
 ├─ styles
 ├─ hooks
 ├─ store
 └─ utils
```

### Backend

```
/src
 ├─ modules
 │   ├─ auth
 │   ├─ users
 │   ├─ products
 │   ├─ orders
 │   ├─ rating
 │   ├─ voucher
 │   ├─ comment
 │   └─ payments
 ├─ config
 └─ common
```

---

## ⚙️ Hướng dẫn chạy dự án

### 1️⃣ Backend (NestJS)

```bash
cd BE
npm install
npm run dev
```

### 2️⃣ Frontend (Next.js)

```bash
cd FE
npm install
npm run dev
```

--- Assets

## 🌐 API chính

| Method | Endpoint       | Mô tả                  |
| ------ | -------------- | ---------------------- |
| GET    | `/products`    | Lấy danh sách sản phẩm |
| POST   | `/orders`      | Tạo đơn hàng           |
| POST   | `/auth/login`  | Đăng nhập              |
| POST   | `/auth/google` | Google OAuth           |

--- API postman

NextNestEcommerce\FE\Ecommerce API Full.postman_collection.json



## ❤️ Lời cảm ơn

Dự án được xây dựng hoàn toàn solo, với mục tiêu rèn luyện kỹ năng Fullstack và tạo ra một hệ thống eCommerce hoàn chỉnh, sạch và dễ mở rộng.

Nếu bạn thấy dự án hay — hãy ⭐ để ủng hộ mình!

---
