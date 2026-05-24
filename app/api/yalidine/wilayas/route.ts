import { NextResponse } from "next/server";

export async function GET() {

try{

const response=
await fetch(
"https://api.yalidine.com/v1/wilayas",
{
headers:{
Authorization:
process.env.YALIDINE_API!
}
}
);

const data=
await response.json();

console.log(
"WILAYAS:",
data
);

return NextResponse.json(
data
);

}catch(error){

console.log(
error
);

return NextResponse.json(
{
data:[]
}
)

}

}