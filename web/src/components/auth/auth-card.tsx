import { CatalogImage } from "@/components/app/catalog-image";
import { SITE_PHOTOS } from "@/lib/site-photos";
import Link from "next/link";

import { PhotoCredit } from "@/components/app/photo-credit";

type AuthCardProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** The original split login card: photo on the left, form on the right. */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border bg-card p-3 md:grid-cols-2">
      {/* The original hides the photo on phones. */}
      <div className="relative hidden min-h-144 overflow-hidden rounded-xl md:block">
        <CatalogImage
          src={SITE_PHOTOS.auth}
          alt="A hiker walking a mountain trail toward distant peaks"
          fill
          sizes="(min-width: 768px) 28rem, 0px"
          className="object-cover"
        />
        <PhotoCredit
          name="Josh Hild"
          url="https://unsplash.com/@joshhild?utm_source=trailventure&utm_medium=referral"
          tone="overlay"
          className="absolute right-3 bottom-3"
        />
      </div>
      <div className="flex flex-col justify-center gap-8 px-5 py-8 sm:px-10">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="type-heading">{title}</h1>
          {description ? (
            <div className="type-ui text-pretty text-muted-foreground">{description}</div>
          ) : null}
        </header>
        {children}
        {footer ? <div className="text-center type-ui text-muted-foreground">{footer}</div> : null}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-medium text-foreground underline underline-offset-4">
      {children}
    </Link>
  );
}
