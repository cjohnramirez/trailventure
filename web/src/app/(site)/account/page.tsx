import type { Metadata } from "next";

import { AccountDetails } from "./account-details";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false },
};

export default function AccountPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-8">
      <h1 className="title text-6xl font-bold">My account</h1>
      <AccountDetails />
    </div>
  );
}
