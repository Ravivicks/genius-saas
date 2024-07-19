// app/api/chat/route.ts

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { auth } from "@clerk/nextjs/server";
import { checkApiLimit, increaseApiLimit } from "@/lib/actions/api-limit";
import { NextResponse } from "next/server";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
  // Get a language model
  const model = google("models/gemini-1.5-pro-latest");
  try {
    const { userId } = auth();
    const { messages } = await req.json();
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    if (!freeTrial && !isPro) {
      return new NextResponse("free trial has expired", {
        status: 403,
      });
    }
    // Define the system instruction
    const systemInstruction =
      "You are a code generator. You must answer in markdown code snippets.";

    // Add system instruction as the first message in the prompt
    const promptMessages = [
      { role: "system", content: systemInstruction },
      ...messages,
    ];

    // Call the language model with the prompt
    const result = await streamText({
      model,
      messages,
      maxTokens: 4096,
      temperature: 0.7,
      topP: 0.4,
    });
    if (!isPro) {
      await increaseApiLimit();
    }

    // Respond with a streaming response
    return result.toAIStreamResponse();
  } catch (error) {
    console.log("[CODE_ERROR]", error);
    return new NextResponse("Intenal server error", { status: 500 });
  }
}
