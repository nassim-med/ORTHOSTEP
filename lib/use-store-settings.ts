"use client";

import { useEffect, useState } from "react";
import type { StoreSettings } from "../types/product";
import {
  defaultStoreSettings,
  SETTINGS_EVENT,
  SETTINGS_STORAGE_KEY
} from "./store-settings";

export default function useStoreSettings() {

  const [settings,setSettings]=
  useState<StoreSettings>(
    defaultStoreSettings
  );

  useEffect(()=>{

    let active=true;

    async function load(){

      try{

        const response=
        await fetch(
          "/api/admin/settings",
          {
            cache:"no-store"
          }
        );

        if(!response.ok) return;

        const data=
        await response.json();

        if(!active) return;

        setSettings({
          ...defaultStoreSettings,
          ...data
        });

      }catch{

        if(!active)return;

        setSettings(
          defaultStoreSettings
        );

      }

    }

    function onSettingsUpdated(){
      load();
    }

    function onStorage(
      event:StorageEvent
    ){

      if(
        event.key===
        SETTINGS_STORAGE_KEY
      ){

        load();

      }

    }

    load();

    window.addEventListener(
      SETTINGS_EVENT,
      onSettingsUpdated
    );

    window.addEventListener(
      "storage",
      onStorage
    );

    return()=>{

      active=false;

      window.removeEventListener(
        SETTINGS_EVENT,
        onSettingsUpdated
      );

      window.removeEventListener(
        "storage",
        onStorage
      );

    };

  },[]);

  return settings;

}