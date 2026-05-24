"use client";

import { FormEvent, useState } from "react";
import { supabaseBrowser } from "../../lib/supabase-browser";
import type { StoreSettings } from "../../types/product";
import {
  defaultStoreSettings,
  SETTINGS_EVENT,
  SETTINGS_STORAGE_KEY,
  safeUrl
} from "../../lib/store-settings";

type TabKey =
  | "general"
  | "social"
  | "contact"
  | "branding";

interface SettingsManagerProps {
  initial: StoreSettings;
}

const tabs: {
  key: TabKey;
  label: string;
}[] = [
  {
    key: "general",
    label: "General"
  },
  {
    key: "social",
    label: "Social"
  },
  {
    key: "contact",
    label: "Contact"
  },
  {
    key: "branding",
    label: "Branding"
  }
];

export default function SettingsManager({
  initial
}: SettingsManagerProps) {

  const [activeTab,setActiveTab] =
    useState<TabKey>("general");

  const [formState,setFormState] =
    useState<StoreSettings>({
      ...defaultStoreSettings,
      ...initial
    });

  const [saving,setSaving] =
    useState(false);

  const [uploading,setUploading] =
    useState(false);

  const [toast,setToast] =
    useState("");

  const updateField = <
    K extends keyof StoreSettings
  >(
    key:K,
    value:StoreSettings[K]
  )=>{
    setFormState(prev=>({
      ...prev,
      [key]:value
    }));
  };

  async function handleLogoUpload(
    e:React.ChangeEvent<HTMLInputElement>
  ){

    try{

      const file =
        e.target.files?.[0];

      if(!file) return;

      setUploading(true);

      const fileName =
        Date.now()
        + "-"
        + file.name;

      const {error} =
      await supabaseBrowser
      .storage
      .from("nassim")
      .upload(
        fileName,
        file
      );

      if(error)
        throw error;

      const {data} =
      supabaseBrowser
      .storage
      .from("branding")
      .getPublicUrl(
        fileName
      );

      setFormState(
        prev=>({
          ...prev,
          logo:
          data.publicUrl
        })
      );

      setToast(
        "Logo uploaded successfully"
      );

      setTimeout(()=>{
        setToast("");
      },2500);

    }catch(error){

      console.log(error);

      setToast(
        "Upload failed"
      );

    }finally{

      setUploading(false);

    }
  }

  async function saveSettings(
    event:FormEvent
  ){

    event.preventDefault();

    setSaving(true);

    const payload={
      ...formState,

      facebook:safeUrl(
        formState.facebook
      ),

      instagram:safeUrl(
        formState.instagram
      ),

      tiktok:safeUrl(
        formState.tiktok
      ),

      telegram:safeUrl(
        formState.telegram
      )
    };

    const response=
    await fetch(
      "/api/admin/settings",
      {
        method:"PUT",

        headers:{
          "Content-Type":
          "application/json"
        },

        body:
        JSON.stringify(
          payload
        )
      }
    );

    setSaving(false);

    if(!response.ok)
      return;

    const data=
    await response.json();

    setFormState(
      prev=>({
        ...prev,
        ...data
      })
    );

    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      String(Date.now())
    );

    window.dispatchEvent(
      new Event(
        SETTINGS_EVENT
      )
    );

    setToast(
      "Settings updated"
    );

    setTimeout(()=>{
      setToast("");
    },2600);

  }

  return(

<form
onSubmit={saveSettings}
className="
space-y-6
rounded-[32px]
border
border-slate-200
bg-white
p-6
shadow-soft
"
>

<div className="flex flex-wrap gap-2">

{tabs.map(tab=>(

<button
key={tab.key}
type="button"
onClick={()=>setActiveTab(tab.key)}
className={`rounded-full px-4 py-2 text-sm font-semibold ${
activeTab===tab.key
?
"bg-orthostep text-white"
:
"border border-slate-200"
}`}
>

{tab.label}

</button>

))}

</div>

{activeTab==="branding" && (

<div className="space-y-5">

<div>

<p className="font-semibold mb-3">
Store Logo
</p>

{formState.logo && (

<div className="
rounded-3xl
border
p-4
">

<img
src={formState.logo}
alt="logo"
className="
h-24
w-auto
rounded-lg
object-contain
"
/>

</div>

)}

<input
type="file"
accept="image/*"
onChange={handleLogoUpload}
className="
mt-4
w-full
rounded-2xl
border
p-3
"
/>

{uploading && (

<p className="mt-3">
Uploading...
</p>

)}

</div>

</div>

)}

<div className="
flex
items-center
justify-between
">

<button
type="submit"
disabled={saving}
className="
rounded-full
bg-orthostep
px-6
py-3
text-white
"
>

{saving
?
"Saving..."
:
"Save settings"}

</button>

{toast && (

<p className="
text-sm
text-green-600
">

{toast}

</p>

)}

</div>

</form>

)

}