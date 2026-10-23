# LINE Messaging API Integration

## การเชื่อมต่อระบบ

- เปิดใช้งาน LINE Messaging API
- **ห้ามเผยแพร่ Channel Access Token** หาก Token รั่วไหล ให้ Reissue Token ใหม่ทันที
- กด **Verify** เพื่อยืนยันการเชื่อมต่อ Webhook โดย URL ต้องใช้ HTTPS เท่านั้น
- ทดสอบระบบผ่าน **ngrok** ก่อนเปลี่ยนไปใช้ Production URL

### ฟีเจอร์ที่ใช้งาน

- **Loading** — แสดงสถานะระหว่างประมวลผล
- **Reply Message** — ตอบกลับข้อความจากผู้ใช้
- **Rich Menu** — แสดงเมนูเพื่อให้ผู้ใช้เข้าถึงฟังก์ชันต่าง ๆ
- **Flex Message** — แสดงข้อความในรูปแบบที่ปรับแต่ง Layout ได้

### เครื่องมือที่ใช้

- [LINE Messaging API](https://developers.line.biz/en/services/messaging-api/)
- [LINE Bot Designer](https://developers.line.biz/en/docs/messaging-api/download-bot-designer/#bot-designer-for-macos)
- [Flex Message Simulator](https://developers.line.biz/flex-simulator/?status=success)
- [ngrok](https://ngrok.com/) สำหรับทดสอบ Webhook ในระหว่างพัฒนา

## Timeline การดำเนินงาน

ระยะเวลาดำเนินงานทั้งหมด **1 เดือน**

| ระยะเวลา | งานที่ดำเนินการ |
|---|---|
| สัปดาห์ที่ 1 | วิเคราะห์ความต้องการและออกแบบระบบ |
| สัปดาห์ที่ 2–3 | พัฒนาและทดสอบระบบ |
| สัปดาห์ที่ 4 | ปรับปรุง แก้ไขข้อผิดพลาด และเปิดใช้งานจริง |

## ทีมงานและทรัพยากร

### ทีมงาน

- นักพัฒนา 1 คน
- [พยาบาล 1 คน](https://www.kppmu.go.th/personnel?dpm=7&page=2)

## ความปลอดภัย

- เก็บ Channel Access Token ไว้ใน Environment Variables หรือไฟล์ `.env`
- ห้าม Commit ไฟล์ `.env` หรือ Token ลง Git Repository
- หาก Token รั่วไหล ให้ Reissue Token ทันที
- ตรวจสอบว่า Webhook ใช้ HTTPS และผ่านการ Verify ก่อนเปิดใช้งานจริง

## การทดสอบก่อน Production

1. ตั้งค่า LINE Messaging API และ Webhook URL
2. เปิดเซิร์ฟเวอร์สำหรับพัฒนาและเชื่อมต่อผ่าน ngrok
3. ตรวจสอบว่า Webhook ใช้ HTTPS
4. กด Verify ใน LINE Developers Console
5. ทดสอบ Reply Message, Loading, Rich Menu และ Flex Message
6. ตรวจสอบ Log และแก้ไขข้อผิดพลาด
7. เปลี่ยน Webhook URL เป็น Production URL และทดสอบอีกครั้ง

---

> หมายเหตุ: ควรตรวจสอบการตั้งค่า Webhook, Token และการตอบกลับข้อความให้ครบถ้วนก่อนเปิดใช้งานจริง
