import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Access your API key as an environment variable.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { userId } = auth();
  const body = await req.json();
  const { message } = body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = message;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return NextResponse.json({ text });
  } catch (err) {
    return new Response("internal server error", { status: 500 });
  }
}
