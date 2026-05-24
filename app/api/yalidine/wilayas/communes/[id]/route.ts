import { NextResponse } from "next/server";

export async function GET(
req:Request,
{params}:{params:{wilaya:string}}
){

const response=
await fetch(

`https://api.yalidine.com/v1/communes/?wilaya_id=${params.wilaya}`,

{
headers:{
"X-ID":process.env.YALIDINE_API_ID!,
"X-TOKEN":process.env.YALIDINE_API_TOKEN!
}
}

);

const data=
await response.json();

return NextResponse.json(data);

}