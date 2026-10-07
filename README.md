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

## Deploy ด้วย Vercel

โปรเจกต์นี้ใช้ Vercel **หนึ่ง Project** จาก repository root โดย `vercel.json` ที่ root แยก Backend และ Frontend เป็น Services และกำหนดเส้นทางให้แล้ว

1. Push โค้ดขึ้น GitHub แล้วเลือก repository นี้ในหน้า Import ของ Vercel
2. ตั้ง Root Directory เป็น `./` และ Application Preset เป็น `Services`
3. กด Refresh หลัง `vercel.json` อยู่บน GitHub แล้วตรวจว่าพบ `backend` กับ `frontend` จากนั้นเลือก Import multi-service project
4. ตั้ง Environment Variables ใน Project Settings:

   - `MONGODB_URI`: MongoDB Atlas connection string
   - `BASE_URL`: URL หลักของ Project Vercel เช่น `https://your-project.vercel.app`
   - `FRONTEND_URL`: ใช้ URL เดียวกับ `BASE_URL`
   - `VITE_API_URL`: ใช้ URL เดียวกับ `BASE_URL`

5. Deploy หรือ Redeploy หลังเพิ่ม Environment Variables

ใน Services routing, `/api/...` และ URL short code 6 ตัวอักษรจะไป Backend ส่วนเส้นทางอื่น เช่น `/` และ `/password/:shortCode` จะไป Frontend ทั้งหมดใช้ domain เดียวกัน ดังนั้นลิงก์สั้นที่สร้างใน production จะเป็น `https://your-project.vercel.app/:shortCode` ไม่ใช่ `localhost`.
