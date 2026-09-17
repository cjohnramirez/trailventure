import Link from "next/link";

import { SlotPhoto } from "@/components/app/slot-photo";
import { photos } from "@/lib/photos";

type AuthCardProps = {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

/** The original split login card: photo on the left, form on the right. */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="grid w-full max-w-[56rem] overflow-hidden rounded-2xl border bg-card p-3 md:grid-cols-2">
      {/* The original hides the photo on phones. */}
      <div className="relative hidden min-h-[36rem] overflow-hidden rounded-xl md:block">
        <SlotPhoto photo={photos.auth} sizes="(min-width: 768px) 28rem, 0px" />
      </div>
      <div className="flex flex-col justify-center gap-8 px-5 py-8 sm:px-10">
        <header className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {description ? (
            <div className="text-sm text-pretty text-muted-foreground">{description}</div>
          ) : null}
        </header>
        {children}
        {footer ? <div className="text-center text-sm text-muted-foreground">{footer}</div> : null}
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
