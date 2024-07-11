// app/api/chat/route.ts

import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();

  // Get a language model
  const model = google("models/gemini-1.5-pro-latest");

  // Call the language model with the prompt
  const result = await streamText({
    model,
    messages,
    maxTokens: 4096,
    temperature: 0.7,
    topP: 0.4,
  });

  // Respond with a streaming response
  return result.toAIStreamResponse();
}
