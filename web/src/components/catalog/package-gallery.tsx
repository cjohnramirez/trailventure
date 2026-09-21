import { ImageIcon } from "lucide-react";

import { CatalogImage } from "@/components/app/catalog-image";
import { PhotoCredit } from "@/components/app/photo-credit";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CatalogPhoto } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

/** The original package photo row: up to three photos side by side, adapting to the count. */
export function PackageGallery({ images, name }: { images: CatalogPhoto[]; name: string }) {
  if (images.length === 0) {
    return (
      <div
        role="img"
        aria-label={`Photos of ${name} coming soon`}
        className="flex h-72 items-center justify-center rounded-2xl border bg-muted sm:h-96"
      >
        <ImageIcon aria-hidden="true" className="size-6 text-muted-foreground/60" />
      </div>
    );
  }

  const basis =
    images.length === 1
      ? "basis-full"
      : images.length === 2
        ? "md:basis-1/2"
        : "md:basis-1/2 lg:basis-1/3";

  return (
    <Carousel opts={{ align: "start" }} aria-label={`Photos of ${name}`} className="group/gallery">
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={image.url} className={cn(basis)}>
            <figure className="relative h-72 overflow-hidden rounded-2xl border bg-muted sm:h-96">
              <CatalogImage
                src={image.url}
                alt={image.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
              {image.credit_name ? (
                <figcaption>
                  <PhotoCredit
                    name={image.credit_name}
                    url={image.credit_url}
                    tone="overlay"
                    className="absolute right-3 bottom-3"
                  />
                </figcaption>
              ) : null}
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 ? (
        <>
          <CarouselPrevious className="left-3 lg:hidden" />
          <CarouselNext className="right-3 lg:hidden" />
        </>
      ) : null}
    </Carousel>
  );
}
