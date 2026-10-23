// app/webhook/route.js
import { Client, validateSignature } from "@line/bot-sdk";
import { NextResponse } from "next/server";

import telemedStart from "./flex_messages/TelemedicineStartFlexmessage.json" with { type: "json" };
import news from "./flex_messages/PublicRelationsFlexmessage.json" with { type: "json" };
import telemedMore from "./flex_messages/TelemedicineMoreInfoFlexmessage.json" with { type: "json" };
import contact from "./flex_messages/ContactUsFlexmessage.json" with { type: "json" };
import about from "./flex_messages/AboutUsFlexmessage.json" with { type: "json" };
import general from "./flex_messages/GeneralService.json" with { type: "json" };
import thaiChinese from "./flex_messages/ThaiChineseService.json" with { type: "json" };
import thai from "./flex_messages/ThaiService.json" with { type: "json" };
import faq from "./flex_messages/FaqFlexmessage.json" with { type: "json" };
import healthTips from "./flex_messages/HealthTipsFlexmessage.json" with { type: "json" };

// keyword -> ข้อความตอบกลับ
const keywordMap = {};
const register = (keywords, message) =>
  keywords.forEach((k) => (keywordMap[k.toLowerCase()] = message));

register(["เริ่มใช้บริการtelemedicine", "เริ่มต้น", "ใช้งาน telemedicine"], telemedStart);
register(["ข้อมูลเพิ่มเติมเกี่ยวกับtelemedicine", "บริการของเรา/qrcode", "บริการ", "telemedicine>ดูเพิ่มเติม"], telemedMore);
register(["ประชาสัมพันธ์", "ข่าวประชาสัมพันธ์"], news);
register(["ติดต่อเรา"], contact);
register(["เกี่ยวกับเรา"], about);
register(["ตรวจโรคทั่วไป"], general);
register(["แพทย์แผนจีนและแผนไทย"], thaiChinese);
register(["แพทย์แผนไทย"], thai);
register(["คำถามที่พบบ่อย", "faq"], faq);
register(["สาระสุขภาพ", "health tips"], healthTips);

// แสดง loading animation (ไม่ให้ error นี้ขัดขวางการตอบกลับ)
const showLoading = (userId) =>
  fetch("https://api.line.me/v2/bot/chat/loading/start", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ chatId: userId, loadingSeconds: 5 }),
  }).catch((err) => console.error("Loading animation failed:", err));

export async function GET() {
  return NextResponse.json({ status: "ok", message: "Bot is live!" });
}

export async function POST(request) {
  const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
  };

  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature");

    if (!validateSignature(body, config.channelSecret, signature)) {
      return new Response("Invalid signature", { status: 401 });
    }

    const client = new Client(config);
    const { events = [] } = JSON.parse(body);

    await Promise.all(
      events.map(async (event) => {
        if (event.type !== "message" || event.message.type !== "text") return null;

        const reply = keywordMap[event.message.text.trim().toLowerCase()];
        if (!reply) return null;

        if (event.source.userId) await showLoading(event.source.userId);
        return client.replyMessage(event.replyToken, reply);
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}