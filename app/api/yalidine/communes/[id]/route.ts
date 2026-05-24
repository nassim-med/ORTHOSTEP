import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  {
    params
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  const { id } = await params;

  try {

    const response = await fetch(
      `${process.env.YALIDINE_API}/communes/?wilaya_id=${id}`,
      {
        method: "GET",
        headers: {
          "X-API-ID": process.env.YALIDINE_ID || "",
          "X-API-TOKEN": process.env.YALIDINE_TOKEN || "",
          Accept: "application/json"
        },
        cache: "no-store"
      }
    );

    const data = await response.json();

    console.log("COMMUNES STATUS:", response.status);
    console.log(data);

    return NextResponse.json(data);

  } catch (error) {

    console.log(error);

    return NextResponse.json({
      data:[]
    });

  }

}