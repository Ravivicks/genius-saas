// app/api/limewire.js

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { prompt, aspect_ratio } = await req.json();

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

  const data = await response.json();
  return NextResponse.json(data);
}
