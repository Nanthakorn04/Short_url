# URL Shortener

เว็บสำหรับสร้างลิงก์สั้นจาก URL เดิม รองรับการตั้งรหัสผ่านสำหรับลิงก์ สร้าง QR Code และบันทึกจำนวนครั้งที่มีคนเปิดลิงก์

## เทคโนโลยี

- Frontend: React, Vite, Bootstrap
- Backend: Node.js, Express
- Database: MongoDB Atlas
- Libraries: bcrypt, nanoid, qrcode, cors, dotenv

## โครงสร้างโปรเจกต์

```text
short-url/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    └── vercel.json
```

## เริ่มใช้งานในเครื่อง

ต้องติดตั้ง Node.js และเตรียม MongoDB Atlas ก่อน จากนั้นเปิด Terminal แยก 2 หน้าต่าง

### 1. ตั้งค่าและเปิด Backend

เข้าโฟลเดอร์ `backend` แล้วติดตั้ง dependencies:

```bash
cd backend
npm install
```

สร้างไฟล์ `backend/.env`:

```env
PORT=5001
MONGODB_URI=<MongoDB Atlas connection string>
BASE_URL=http://localhost:5001
FRONTEND_URL=http://localhost:5173
```

`FRONTEND_URL` ต้องตรงกับ URL ที่ Vite แสดงใน Terminal หากพอร์ต `5173` ถูกใช้งาน Vite อาจเลือกพอร์ตอื่น ให้แก้ค่านี้ให้ตรงกัน

เปิด Backend:

```bash
npm run dev
```

### 2. ตั้งค่าและเปิด Frontend

เปิด Terminal อีกหน้าต่าง เข้าโฟลเดอร์ `frontend` แล้วติดตั้ง dependencies:

```bash
cd frontend
npm install
```

สร้างไฟล์ `frontend/.env`:

```env
VITE_API_URL=http://localhost:5001
```

เปิด Frontend:

```bash
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal

## API หลัก

| Method | Path | หน้าที่ |
| --- | --- | --- |
| `POST` | `/api/urls` | สร้าง Short URL และ QR Code |
| `GET` | `/:shortCode` | เปิด Short URL หรือพาไปกรอกรหัสผ่าน |
| `POST` | `/:shortCode/verify` | ตรวจรหัสผ่านและเปิดลิงก์ |
| `GET` | `/api/urls/history` | ดูประวัติ URL, QR Code และจำนวนคลิก |


## หมายเหตุ

โปรเจกต์นี้ยังไม่มีระบบ Login ดังนั้น History เป็นรายการรวมของ URL ที่ถูกสร้างทั้งหมด
