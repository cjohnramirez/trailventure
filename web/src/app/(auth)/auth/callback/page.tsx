import type { Metadata } from "next";
import { Suspense } from "react";

import { CallbackHandler } from "./callback-handler";

export const metadata: Metadata = {
  title: "Signing in",
  robots: { index: false },
};

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackHandler />
    </Suspense>
  );
}
