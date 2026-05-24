"use client";

import { useEffect, useState } from "react";
import type { StoreSettings } from "../types/product";
import {
  defaultStoreSettings,
  SETTINGS_EVENT,
  SETTINGS_STORAGE_KEY
} from "./store-settings";

export default function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(defaultStoreSettings);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await fetch("/api/store-settings", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as StoreSettings;
        if (!active) return;
        setSettings({ ...defaultStoreSettings, ...data });
      } catch {
        if (!active) return;
        setSettings(defaultStoreSettings);
      }
    };

    const onSettingsUpdated = () => {
      load();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === SETTINGS_STORAGE_KEY) {
        load();
      }
    };

    load();
    window.addEventListener(SETTINGS_EVENT, onSettingsUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      active = false;
      window.removeEventListener(SETTINGS_EVENT, onSettingsUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return settings;
}
