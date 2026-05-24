"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "./QuantitySelector";
import ProductImageGallery from "./ProductImageGallery";
import type { Product, ProductColor } from "../types/product";
import { getWhatsAppLink } from "../lib/store-settings";

interface OrderFormProps {
  language: "fr" | "ar";
  product: Product;
  whatsapp: string;
}

function normalizeColors(
  colors: ProductColor[] | Array<string | ProductColor>
) {
  return colors.map((color) =>
    typeof color === "string"
      ? { name: color }
      : color
  );
}

export default function OrderForm({
  language,
  product,
  whatsapp
}: OrderFormProps) {

  const [mounted,setMounted]=
  useState(false);

  const normalizedColors =
  useMemo(
  ()=>normalizeColors(
  product.colors as Array<
  string |
  ProductColor
  >
  ),
  [product.colors]
  );

  const [selectedColor,
  setSelectedColor]=
  useState(
  normalizedColors[0]?.name || ""
  );

  const [selectedSize,
  setSelectedSize]=
  useState<number|null>(
  product.sizes[0] || null
  );

  const [quantity,
  setQuantity]=
  useState(1);

  const [customerName,
  setCustomerName]=
  useState("");

  const [phone,
  setPhone]=
  useState("");

  const [address,
  setAddress]=
  useState("");

  const [mainImage,
  setMainImage]=
  useState(
  product.images[0]
  );

  // YALIDINE

  const [wilayas,
  setWilayas]=
  useState<any[]>([]);

  const [communes,
  setCommunes]=
  useState<any[]>([]);

  const [selectedWilaya,
  setSelectedWilaya]=
  useState("");

  const [selectedCommune,
  setSelectedCommune]=
  useState("");

  const [deliveryPrice,
  setDeliveryPrice]=
  useState(0);

  const totalPrice =
  product.price *
  quantity +
  deliveryPrice;

  const isArabic =
  language==="ar";

  useEffect(()=>{
    setMounted(true);
  },[]);

  useEffect(()=>{

    fetch(
    "/api/yalidine/wilayas"
    )
    .then(
    res=>res.json()
    )
    .then(data=>{

    setWilayas(
    data.data || []
    )

    })

  },[]);

  const handleWilaya=
  (id:string)=>{

  setSelectedWilaya(id);

  fetch(
  `/api/yalidine/communes/${id}`
  )

  .then(
  res=>res.json()
  )

  .then(data=>{

  setCommunes(
  data.data || []
  )

  })

  };

  useEffect(() => {

    setSelectedColor(
    normalizedColors[0]?.name || ""
    );

    setSelectedSize(
    product.sizes[0] ?? null
    );

    setMainImage(
    product.images[0]
    );

  }, [product,normalizedColors]);

  const handleColorChange=
  (color:string)=>{

    setSelectedColor(
    color
    );

    const colorObj=
    normalizedColors.find(
    c=>c.name===color
    );

    if(
    colorObj?.imageUrl
    ){

      setMainImage(
      colorObj.imageUrl
      );

      return;
    }

    const colorIndex=
    normalizedColors.findIndex(
    c=>c.name===color
    );

    if(
    colorIndex>=0 &&
    product.images[colorIndex]
    ){

      setMainImage(
      product.images[
      colorIndex
      ]
      );

    }

  };

const handleSubmit=
(e:FormEvent)=>{

e.preventDefault();

if(
!selectedSize ||
!customerName ||
!phone ||
!address ||
!selectedWilaya ||
!selectedCommune
){

alert(
isArabic
?
"يرجى ملء جميع الحقول"
:
"Veuillez remplir tous les champs"
);

return;

}

const message=
`🛍️ *ORTHOSTEP ORDER*

👤 ${customerName}

📱 ${phone}

📍 ${address}

Wilaya:
${selectedWilaya}

Commune:
${selectedCommune}

📦 ${product.title}

🎨 ${selectedColor}

📏 ${selectedSize}

📊 ${quantity}

💰 Product:
${product.price}

🚚 Delivery:
${deliveryPrice}

✅ TOTAL:
${totalPrice}
`;

const whatsappUrl=
getWhatsAppLink(
whatsapp,
message
);

window.open(
whatsappUrl,
"_blank"
);

};

return(

<form
onSubmit={
handleSubmit
}
className="
space-y-6
"
>

<ProductImageGallery
images={
mainImage
?
[
mainImage,
...product.images.filter(
image=>
image!==mainImage
)
]
:
product.images
}
title={
product.title
}
/>

<div className="
rounded-xl
bg-slate-50
p-4
">

<h1 className="
text-2xl
font-bold
">

{product.title}

</h1>

<p className="
mt-4
text-3xl
font-bold
text-orthostep
">

{product.price.toLocaleString(
"fr-FR"
)} DZD

</p>

</div>

<ColorSelector
language={language}
colors={
normalizedColors
}
selectedColor={
selectedColor
}
onColorChange={
handleColorChange
}
/>

<SizeSelector
language={language}
sizes={
product.sizes
}
selectedSize={
selectedSize
}
onSizeChange={
setSelectedSize
}
/>

<QuantitySelector
language={language}
quantity={quantity}
onQuantityChange={
setQuantity
}
/>

<div className="
space-y-3
border-t
pt-6
">

<input
type="text"
placeholder={
isArabic
?
"الاسم"
:
"Nom"
}
value={
customerName
}
onChange={
e=>
setCustomerName(
e.target.value
)
}
className="
w-full
rounded-lg
border
px-4
py-3
"
/>

<input
type="tel"
placeholder="
Whatsapp
"
value={phone}
onChange={
e=>
setPhone(
e.target.value
)
}
className="
w-full
rounded-lg
border
px-4
py-3
"
/>

<input
type="text"
placeholder={
isArabic
?
"العنوان"
:
"Adresse"
}
value={address}
onChange={
e=>
setAddress(
e.target.value
)
}
className="
w-full
rounded-lg
border
px-4
py-3
"
/>

{mounted&&(

<select
value={
selectedWilaya
}
onChange={
e=>
handleWilaya(
e.target.value
)
}
className="
w-full
rounded-lg
border
px-4
py-3
"
>

<option>

Choisir Wilaya

</option>

{wilayas.map(
(w:any)=>(

<option
key={w.id}
value={w.id}
>

{w.name}

</option>

)
)}

</select>

)}

{mounted&&(

<select
value={
selectedCommune
}
onChange={
e=>
setSelectedCommune(
e.target.value
)
}
className="
w-full
rounded-lg
border
px-4
py-3
"
>

<option>

Choisir Commune

</option>

{communes.map(
(c:any)=>(

<option
key={c.id}
value={c.name}
>

{c.name}

</option>

)
)}

</select>

)}

</div>

<button
type="submit"
className="
w-full
rounded-xl
bg-orthostep
py-4
text-white
font-bold
"
>

{isArabic
?
"اطلب عبر واتساب"
:
"Commander"}

</button>

</form>

)

}