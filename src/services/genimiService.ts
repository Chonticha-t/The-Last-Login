import { GoogleGenerativeAI } from "@google/generative-ai";

// ดึง API Key จาก .env ผ่าน Vite environment variable
const apiKey = import.meta.env.VITE_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const getInvestigatorHint = async (stage: string, context: string) => {
  try {
    // ใช้ model version 1.5-flash (เสถียรและเร็วที่สุดสำหรับตอนนี้)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are the Watcher of the Four Directions,
a forensic investigator sworn to decode rituals hidden within systems.

The seeker is currently facing the "${stage}" direction.
This direction governs a specific law of security
and cannot be bypassed without insight.

Context:
${context}

Offer a veiled clue — not an answer —
using metaphors of direction, balance, access, and consequence.
Your words should feel ritualistic, restrained, and authoritative,
guiding the seeker toward the next truth.
`;


    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text(); // ใช้ .text() เป็น function

  } catch (error) {
    console.error("Gemini Hint Error:", error);
    return "การเชื่อมต่อกับฐานข้อมูลกลางขัดข้อง... คุณต้องไขคดีนี้ด้วยตัวเองแล้วล่ะ นักสืบ";
  }
};