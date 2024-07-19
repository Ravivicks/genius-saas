// app/api/limewire.js

import { checkApiLimit, increaseApiLimit } from "@/lib/actions/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, aspect_ratio } = await req.json();

    const { userId } = auth();
    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!freeTrial && !isPro) {
      return new NextResponse("free trial has expired", {
        status: 403,
      });
    }

    const response = await fetch(
      `https://api.limewire.com/api/image/generation`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Version": "v1",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.LIME_API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          aspect_ratio,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        error: `Error: ${response.status} ${response.statusText}`,
        details: errorText,
      });
    }

    if (!isPro) {
      await increaseApiLimit();
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log("[IMAGE_ERROR]", error);
    return new NextResponse("Intenal server error", { status: 500 });
  }
}
