"use client";

import Image from "next/image";
import useStoreSettings from "../lib/use-store-settings";

export default function StoreLogo() {
  const settings = useStoreSettings();

  return (
    <div className="flex items-center justify-center">
      {settings?.logo ? (
        <Image
          src={settings.logo}
          alt="ORTHOSTEP"
          width={220}
          height={90}
          priority
          className="h-14 w-auto object-contain sm:h-16 md:h-20"
        />
      ) : null}
    </div>
  );
}