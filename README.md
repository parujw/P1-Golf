# P1D1 Golf Day 2026 – ระบบคำนวณและประกาศผล

ระบบคำนวณ **System 36** แยก 2 Flight, ประเภทก๊วน (4 คน), Best Gross และ **Nearest to Pin**
พร้อมหน้ากติกาและวิธีคำนวณรายหลุม · Deploy บน **Vercel** · เก็บข้อมูลบน **Firebase Firestore** (เรียลไทม์)
ไม่ต้องล็อกอิน — ใครมีลิงก์ดูผลและกรอกสกอร์ได้

## เชื่อม Firestore (ครั้งเดียว ~5 นาที)
1. https://console.firebase.google.com → **Add project**
2. **Build → Firestore Database → Create database** (region `asia-southeast1`)
3. แท็บ **Rules** → วางเนื้อหาไฟล์ `firestore.rules` → **Publish**
4. **Project settings ⚙️ → Your apps → Web `</>`** → Register app → คัดลอก `firebaseConfig = { ... }`
5. ใส่ค่าใน `config.js` (ใส่แล้ว) หรือ Vercel → Settings → Environment Variables
   เพิ่ม `FIREBASE_CONFIG` = วาง `{ apiKey: "...", authDomain: "...", projectId: "...", ... }` (Production)
6. **Deployments → Redeploy**

ถ้ายังไม่ได้ตั้ง `FIREBASE_CONFIG` เว็บจะทำงานแบบ "เครื่องเดียว" (เก็บข้อมูลใน browser)

## กติกาการคำนวณ
- Par หรือดีกว่า = 2 แต้ม · Bogey = 1 · Double Bogey ขึ้นไป = 0
- Handicap = 36 − แต้มรวม · Net = Gross − Handicap
- เสมอ: HC น้อยกว่า → Gross 9/6/3/1 หลุมหลัง
- ก๊วน: รวม Net ดีที่สุด 3 ใน 4 คน
