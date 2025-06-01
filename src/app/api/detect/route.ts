import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { base64 } = await req.json();

  const apiUrl = process.env.OBJECT_DETECTION_API_URL;
  const apiKey = process.env.OBJECT_DETECTION_API_KEY;

  if (!apiUrl || !apiKey) {
    return NextResponse.json({ error: "Missing API config" }, { status: 500 });
  }

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: apiKey,
      inputs: {
        image: {
          type: "base64",
          value: base64,
        },
      },
    }),
  });

  const data = await response.json();
  console.log("Roboflow API result:", JSON.stringify(data, null, 2));
  return NextResponse.json(data);
}
