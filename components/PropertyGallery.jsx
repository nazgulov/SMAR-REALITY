"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function PropertyGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const hasImages = images.length > 0;
  const isOpen = activeIndex !== null;
  const activeImage = isOpen ? images[activeIndex] : null;

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return current;
      }

      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
      }

      if (event.key === "Escape") {
        event.preventDefault();
        setActiveIndex(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, showNext, showPrevious]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!hasImages) {
    return null;
  }

  return (
    <section>
      <h2 className="text-2xl font-semibold text-ink">Fotogalerie</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-200 text-left shadow-sm"
            aria-label={`${title} - zvětšit fotku ${index + 1}`}
            data-testid={`gallery-thumbnail-${index}`}
          >
            <Image
              src={image}
              alt={`${title} - galerie ${index + 1}`}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
              sizes="(min-width: 1024px) 28vw, (min-width: 640px) 33vw, 100vw"
            />
          </button>
        ))}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/90 px-4 py-5 text-white sm:px-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Fotogalerie - ${title}`}
          data-testid="property-gallery-lightbox"
        >
          <div className="mx-auto flex h-full max-w-7xl flex-col">
            <div className="flex items-center justify-between gap-4 pb-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-100">
                  {title}
                </p>
                <p className="mt-1 text-xs font-medium text-zinc-400">
                  {activeIndex + 1} / {images.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveIndex(null)}
                className="focus-ring inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
                aria-label="Zavřít galerii"
                data-testid="gallery-close"
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              {images.length > 1 ? (
                <button
                  type="button"
                  onClick={showPrevious}
                  className="focus-ring absolute left-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white shadow-lg backdrop-blur transition hover:bg-white/25 sm:left-4 sm:h-14 sm:w-14"
                  aria-label="Předchozí fotka"
                  data-testid="gallery-previous"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
              ) : null}

              <div className="relative h-full w-full">
                <Image
                  src={activeImage}
                  alt={`${title} - galerie ${activeIndex + 1}`}
                  fill
                  priority
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              {images.length > 1 ? (
                <button
                  type="button"
                  onClick={showNext}
                  className="focus-ring absolute right-0 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/12 text-white shadow-lg backdrop-blur transition hover:bg-white/25 sm:right-4 sm:h-14 sm:w-14"
                  aria-label="Další fotka"
                  data-testid="gallery-next"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
