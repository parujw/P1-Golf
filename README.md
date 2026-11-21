# P1D1 Golf Day 2026 – ระบบคำนวณและประกาศผล

ระบบคำนวณ **System 36** แยก 2 Flight, ประเภทก๊วน (4 คน) และ **Nearest to Pin** พร้อมหน้ากติกาและวิธีคำนวณรายหลุม

🔗 เว็บ: https://parujw.github.io/P1-Golf/

## โหมดการทำงาน
| โหมด | เงื่อนไข | ผล |
|---|---|---|
| เครื่องเดียว | `config.js` ยังเป็น `null` | ข้อมูลเก็บใน browser เครื่องนั้น — ใช้ซ้อมได้ |
| ออนไลน์ | ใส่ Firebase config แล้ว | ทุกเครื่องเห็นผลเรียลไทม์ · ผู้ชมไม่ต้องล็อกอิน · ผู้จดสกอร์ล็อกอินด้วย Google |

## ตั้งค่า Firebase (ฟรี ~10 นาที)
1. ไปที่ https://console.firebase.google.com → **Add project**
2. **Build → Firestore Database → Create database** (เลือก region `asia-southeast1`, Production mode)
3. แท็บ **Rules** → วางเนื้อหาจาก `firestore.rules` แก้อีเมลผู้จดสกอร์ → **Publish**
4. **Build → Authentication → Get started → Sign-in method → Google → Enable**
5. Authentication → **Settings → Authorized domains → Add** `parujw.github.io`
6. **Project settings (⚙️) → Your apps → Web (</>)** → Register → คัดลอก `firebaseConfig`
7. วางลงใน `config.js` แทน `null` แล้ว commit

## กติกาการคำนวณ
- Par หรือดีกว่า = 2 แต้ม · Bogey = 1 · Double Bogey ขึ้นไป = 0
- Handicap = 36 − แต้มรวม · Net = Gross − Handicap
- เสมอ: HC น้อยกว่า → Gross 9/6/3/1 หลุมหลัง
- ก๊วน: รวม Net ดีที่สุด 3 ใน 4 คน
