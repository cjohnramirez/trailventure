"use client";

import Link from "next/link";

import { AccountHeader, AccountHeaderSkeleton } from "@/components/account/account-header";
import { BookingsSection } from "@/components/account/bookings-section";
import { ReviewsSection } from "@/components/account/reviews-section";
import { UserDetails, UserDetailsSkeleton } from "@/components/account/user-details";
import { ErrorState } from "@/components/app/error-state";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAccount, useCapabilities } from "@/lib/account/use-account";

/** The original user page: banner and profile, User Details, Your Bookings and Your Reviews. */
export function AccountDetails() {
  const account = useAccount();
  const capabilities = useCapabilities();

  if (account.isError) {
    // A 403 means the session ended while the page was open.
    const loggedOut = account.error instanceof Error && account.error.message.includes("session");
    return loggedOut ? (
      <Alert>
        <AlertTitle>You’re logged out</AlertTitle>
        <AlertDescription>Log in again to see your account.</AlertDescription>
        <AlertAction>
          <Button asChild size="sm" variant="brand">
            <Link href="/login?next=/account">Login</Link>
          </Button>
        </AlertAction>
      </Alert>
    ) : (
      <ErrorState
        title="We couldn’t load your account"
        description="Check your connection and try again."
        onRetry={() => void account.refetch()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {account.isPending ? (
        <AccountHeaderSkeleton />
      ) : (
        <AccountHeader
          account={account.data}
          canUploadPhotos={capabilities.data?.photo_uploads ?? false}
        />
      )}

      {account.isPending ? <UserDetailsSkeleton /> : <UserDetails account={account.data} />}
      <Separator />
      <BookingsSection />
      <Separator />
      <ReviewsSection />
    </div>
  );
}
