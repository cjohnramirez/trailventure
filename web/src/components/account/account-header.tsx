"use client";

import { ExternalLinkIcon } from "lucide-react";

import { PhotoButton } from "@/components/account/photo-button";
import { CatalogImage } from "@/components/app/catalog-image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Account } from "@/lib/account/types";

// Lucide dropped its brand icons, so the original's logo pills became labelled links.
const SOCIALS = [
  { key: "facebook_url", label: "Facebook" },
  { key: "x_url", label: "X" },
  { key: "instagram_url", label: "Instagram" },
] as const;

function initials(account: Account) {
  const letters = `${account.first_name} ${account.last_name}`.trim() || account.email;
  return letters.slice(0, 2).toUpperCase();
}

/**
 * The original user page's banner with the avatar overlapping a profile card. Photo controls only
 * appear when the API has Cloudinary configured.
 */
export function AccountHeader({
  account,
  canUploadPhotos,
}: {
  account: Account;
  canUploadPhotos: boolean;
}) {
  const fullName = `${account.first_name} ${account.last_name}`.trim() || account.display_name;
  const links = SOCIALS.filter((social) => account.profile[social.key]);

  return (
    <section aria-labelledby="profile-title" className="flex flex-col">
      <div className="relative h-40 overflow-hidden rounded-2xl bg-surface-muted sm:h-56 lg:h-[300px]">
        {account.profile.banner_url ? (
          <CatalogImage
            src={account.profile.banner_url}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
        {canUploadPhotos ? (
          <PhotoButton
            kind="banner"
            label="Banner"
            hasPhoto={Boolean(account.profile.banner_url)}
            className="absolute top-4 right-4"
          />
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-5 rounded-2xl border bg-background p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-8">
        {/* The avatar reaches up over the banner, as it did on the original user page. */}
        <div className="-mt-20 flex flex-col items-start gap-3 sm:-mt-24 lg:-mt-32">
          <Avatar className="size-24 rounded-2xl after:rounded-2xl sm:size-32 lg:size-[180px]">
            <AvatarImage
              src={account.profile.avatar_url || undefined}
              alt=""
              className="rounded-2xl"
            />
            <AvatarFallback className="rounded-2xl type-heading">
              {initials(account)}
            </AvatarFallback>
          </Avatar>
          {canUploadPhotos ? (
            <PhotoButton
              kind="avatar"
              label="Photo"
              hasPhoto={Boolean(account.profile.avatar_url)}
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <p className="type-ui text-muted-foreground">Customer Profile</p>
          <h2 id="profile-title" className="type-heading text-pretty">
            {fullName}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="rounded-full">
              {account.email_verified ? "Email verified" : "Email not verified"}
            </Badge>
            {account.profile.bio ? null : (
              <span className="type-caption text-muted-foreground">No bio yet</span>
            )}
          </div>
          {account.profile.bio ? (
            <p className="type-body text-pretty text-muted-foreground">{account.profile.bio}</p>
          ) : null}
          {links.length > 0 ? (
            <ul className="flex w-fit items-center gap-1 rounded-full border p-1">
              {links.map((social) => (
                <li key={social.key}>
                  <Button asChild variant="ghost" size="sm">
                    <a href={account.profile[social.key]} target="_blank" rel="noreferrer noopener">
                      <ExternalLinkIcon data-icon="inline-start" />
                      {social.label}
                    </a>
                  </Button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AccountHeaderSkeleton() {
  return (
    <div className="flex flex-col" role="status" aria-label="Loading your profile">
      <Skeleton className="h-40 rounded-2xl sm:h-56 lg:h-[300px]" />
      <div className="mt-4 flex flex-col gap-5 rounded-2xl border bg-background p-6 sm:p-8 lg:flex-row lg:gap-8">
        <Skeleton className="-mt-20 size-24 rounded-2xl sm:-mt-24 sm:size-32 lg:-mt-32 lg:size-[180px]" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-56" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    </div>
  );
}
