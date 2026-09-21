import { MapPinIcon, MessageSquareIcon } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PackageGallery } from "@/components/catalog/package-gallery";
import { Rating } from "@/components/catalog/rating";
import { ReviewCard } from "@/components/reviews/review-card";
import { WriteReview } from "@/components/reviews/write-review";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getPackage } from "@/lib/catalog/api";
import { getPackageReviews } from "@/lib/reviews/server";
import { formatCentavos } from "@/lib/format";

import { PackageTiers } from "./package-tiers";
import { SectionNav } from "./section-nav";

export async function generateMetadata({
  params,
}: PageProps<"/package/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug).catch(() => null);
  if (!pkg) return { title: "Package not found" };
  const description = `${pkg.description.slice(0, 150).trim()}…`;
  return {
    title: pkg.name,
    description,
    alternates: { canonical: `/package/${pkg.slug}` },
    openGraph: {
      title: pkg.name,
      description,
      images: pkg.images[0] ? [{ url: pkg.images[0].url, alt: pkg.images[0].alt }] : undefined,
    },
  };
}

export default async function PackagePage({ params }: PageProps<"/package/[slug]">) {
  const { slug } = await params;
  // API outages throw and render error.tsx; unknown slugs render the 404 page.
  const pkg = await getPackage(slug);
  if (!pkg) notFound();
  const reviews = await getPackageReviews(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.name,
    description: pkg.description,
    image: pkg.images.map((image) => image.url),
    touristType: pkg.tiers.map((tier) => tier.name),
    offers: pkg.tiers.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: (tier.price / 100).toFixed(2),
      priceCurrency: "PHP",
    })),
    ...(pkg.rating_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: pkg.rating_avg,
            reviewCount: pkg.rating_count,
          },
        }
      : {}),
  };

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-8 px-4 pt-8 pb-28 sm:px-8">
      <script
        type="application/ld+json"
        // Escape "<" so package text can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <header id="overview" className="flex scroll-mt-28 flex-col gap-3">
        <h1 className="type-page-title text-pretty">{pkg.name}</h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="flex items-center gap-1.5 type-ui text-muted-foreground">
            <MapPinIcon aria-hidden="true" className="size-4.5 shrink-0" />
            {pkg.address}
          </p>
          <Rating average={pkg.rating_avg} count={pkg.rating_count} />
          <p className="type-ui text-muted-foreground">
            from{" "}
            <span className="type-body font-semibold text-foreground tabular-nums">
              {formatCentavos(pkg.min_price)}
            </span>{" "}
            / person
          </p>
        </div>
      </header>

      <PackageGallery images={pkg.images} name={pkg.name} />

      <PackageTiers
        pkg={pkg}
        before={
          <Card id="description" className="scroll-mt-28 rounded-2xl">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="type-body text-pretty whitespace-pre-line">{pkg.description}</p>
            </CardContent>
          </Card>
        }
        after={
          <Card id="reviews" className="scroll-mt-28 rounded-2xl" aria-labelledby="reviews-title">
            <CardHeader>
              <CardTitle id="reviews-title">Reviews</CardTitle>
              <CardAction>
                <WriteReview packageSlug={pkg.slug} />
              </CardAction>
            </CardHeader>
            <CardContent>
              {reviews.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <Empty className="rounded-xl border py-10">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageSquareIcon />
                    </EmptyMedia>
                    <EmptyTitle>No reviews yet</EmptyTitle>
                    <EmptyDescription>
                      Travelers who complete this trip can leave the first review.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </CardContent>
          </Card>
        }
      />

      <SectionNav />
    </div>
  );
}
