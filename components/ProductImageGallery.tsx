"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1528701800489-20d0d0c32d20?auto=format&fit=crop&w=1000&q=80";

export default function ProductImageGallery({
  images,
  title
}: ProductImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isMainLoading, setIsMainLoading] = useState(true);

  const safeImages = useMemo(() => (images.length > 0 ? images : [FALLBACK_IMAGE]), [images]);

  useEffect(() => {
    setMainImageIndex(0);
    setHasError(false);
    setIsMainLoading(true);
  }, [images]);

  const currentImage = hasError ? FALLBACK_IMAGE : safeImages[mainImageIndex] || FALLBACK_IMAGE;

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative h-80 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-96">
        {isMainLoading && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
        <Image
          key={currentImage}
          src={currentImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, 500px"
          className="object-cover"
          priority
          onLoad={() => setIsMainLoading(false)}
          onError={() => {
            setHasError(true);
            setIsMainLoading(false);
          }}
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((image, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setMainImageIndex(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-lg border-2 transition ${
                mainImageIndex === index
                  ? "border-orthostep"
                  : "border-slate-200 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                fill
                sizes="64px"
                className="object-cover"
                onError={() => setHasError(true)}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
