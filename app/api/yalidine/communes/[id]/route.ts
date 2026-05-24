import { NextResponse } from "next/server";

export async function GET(
request: Request,
{ params }:{
params:Promise<{
id:string
}>
}
){

const {id}=
await params;

try{

const response=
await fetch(
`https://api.yalidine.com/v1/communes/?wilaya_id=${id}`,
{
headers:{
Authorization:
process.env.YALIDINE_API!
}
}
);

const data=
await response.json();

return NextResponse.json(
data
);

}catch{

return NextResponse.json(
{
data:[]
}
)

}

}