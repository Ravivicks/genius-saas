import { checkApiLimit, increaseApiLimit } from "@/lib/actions/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;
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
    const input = {
      prompt: prompt,
    };

    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      { input }
    );
    if (!isPro) {
      await increaseApiLimit();
    }
    return NextResponse.json(output);
  } catch (error) {
    console.log("[VIDEO_ERROR]", error);
    return new NextResponse("Internal errror", { status: 500 });
  }
}
