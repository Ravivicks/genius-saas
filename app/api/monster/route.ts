import { checkApiLimit, increaseApiLimit } from "@/lib/actions/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENART_API_KEY!;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt");
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is missing" }, { status: 400 });
    }

    if (!freeTrial && !isPro) {
      return new NextResponse("free trial has expired", {
        status: 403,
      });
    }

    if (API_KEY) {
      const requestBody = new FormData();
      requestBody.append("prompt", prompt as string);

      const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
        method: "POST",
        headers: {
          "x-api-key": API_KEY,
          // "Content-Type" should not be set when using FormData
        },
        body: requestBody,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to generate image:", errorText);
        return NextResponse.json(
          { error: "Failed to generate image" },
          { status: 500 }
        );
      }

      if (!isPro) {
        await increaseApiLimit();
      }

      const imageData = await response.blob();
      return new NextResponse(imageData, {
        status: 200,
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": "attachment; filename=result.png",
        },
      });
    } else {
      return NextResponse.json(
        { error: "API_KEY is missing" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
