"use client";

import useStoreSettings from "../lib/use-store-settings";

export default function StoreLogo() {
  const settings = useStoreSettings();

  console.log("SETTINGS:", settings);

  return (
    <div className="flex flex-col items-center gap-2 border p-4">

      <p className="text-xs">
        LOGO URL:
      </p>

      <p className="text-[10px] break-all text-red-500">
        {settings.logo || "EMPTY"}
      </p>

      {settings.logo ? (
        <img
          src={settings.logo}
          alt="logo"
          className="h-20 object-contain"
        />
      ) : (
        <h1 className="text-3xl font-bold">
          ORTHOSTEP
        </h1>
      )}

    </div>
  );
}