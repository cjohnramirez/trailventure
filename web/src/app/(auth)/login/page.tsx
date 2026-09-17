import type { Metadata } from "next";
import { Suspense } from "react";

import { AuthCardSkeleton } from "@/components/auth/auth-card-skeleton";

import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to book tour packages and manage your trips on TrailVenture.",
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}
