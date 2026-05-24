import { NextResponse } from "next/server";

export async function GET() {
  try {

    const response = await fetch(
      "https://api.yalidine.com/v1/wilayas",
      {
        headers:{
          "X-ID":process.env.YALIDINE_API_ID!,
          "X-TOKEN":process.env.YALIDINE_API_TOKEN!
        }
      }
    );

    const data =
    await response.json();

    return NextResponse.json(data);

  } catch {

    return NextResponse.json(
      {error:"failed"},
      {status:500}
    );

  }
}