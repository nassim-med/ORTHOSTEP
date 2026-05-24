import { NextResponse } from "next/server";
import { supabaseServer } from "../../../../lib/supabase-server";
import { defaultStoreSettings } from "../../../../lib/store-settings";

export async function GET() {

  const {data,error}=
  await supabaseServer
  .from("store_settings")
  .select("*")
  .limit(1)
  .single();

  if(error){

    console.log(error);

    return NextResponse.json(
      defaultStoreSettings
    );

  }

  return NextResponse.json({

    ...defaultStoreSettings,
    ...data

  });

}


export async function PUT(
request:Request
){

try{

const payload=
await request.json();

const nextPayload={

...payload,

updated_at:
new Date()
.toISOString()

};


const {data:existing}=
await supabaseServer
.from("store_settings")
.select("id")
.limit(1)
.maybeSingle();


if(existing?.id){

const {data,error}=
await supabaseServer
.from("store_settings")
.update(
nextPayload
)
.eq(
"id",
existing.id
)
.select()
.single();

if(error)
throw error;

return NextResponse.json(
data
);

}


const {data,error}=
await supabaseServer
.from("store_settings")
.insert(
{
...defaultStoreSettings,
...nextPayload
}
)
.select()
.single();

if(error)
throw error;

return NextResponse.json(
data
);

}catch(error){

console.log(error);

return NextResponse.json(
{
error:
"Failed"
},
{
status:500
}
);

}

}