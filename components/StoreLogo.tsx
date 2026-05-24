"use client";

interface StoreLogoProps{
  logo?:string;
  storeName?:string;
}

export default function StoreLogo({
  logo,
  storeName
}:StoreLogoProps){

return(

<div className="flex justify-center">

{logo ? (

<img
src={logo}
alt="logo"
className="
max-h-[110px]
w-auto
object-contain
"
/>

) : (

<h1
className="
text-3xl
font-bold
text-slate-900
"
>

{storeName || "ORTHOSTEP"}

</h1>

)}

</div>

);

}