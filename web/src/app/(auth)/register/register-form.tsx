"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SubmitButton } from "@/components/app/submit-button";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { GoogleButton } from "@/components/auth/google-button";
import { TextField } from "@/components/auth/text-field";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { allauth } from "@/lib/auth/allauth";
import { safeNextPath } from "@/lib/auth/redirects";
import { PASSWORD_MIN_LENGTH, registerSchema, type RegisterValues } from "@/lib/auth/schemas";
import { useRefreshSession } from "@/lib/auth/session";
import { useAuthSubmit } from "@/lib/auth/use-auth-form";

export function RegisterForm() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"));
  const refreshSession = useRefreshSession();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { first_name: "", last_name: "", email: "", password: "", password_confirm: "" },
  });
  const { run, pending, formError } = useAuthSubmit(form);

  const onSubmit = (values: RegisterValues) =>
    run(
      () =>
        allauth.signup({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
        }),
      async (result) => {
        if (result.kind === "pending" && result.flow === "verify_email") {
          toast.success("Account created. Check your email for a 6-digit code.");
          router.push(`/verify-email?next=${encodeURIComponent(next)}`);
          return;
        }
        if (result.kind === "authenticated") {
          await refreshSession();
          router.replace(next);
          return;
        }
        // With email enumeration prevention, signing up with an existing address also lands here:
        // the owner gets an email instead of an error on the page.
        router.push(`/verify-email?next=${encodeURIComponent(next)}`);
      },
    );

  return (
    <AuthCard
      title="Create an Account"
      description={
        <>
          Do you have an existing account?{" "}
          <AuthLink href={`/login?next=${encodeURIComponent(next)}`}>Login</AuthLink>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <FormAlert message={formError} />
        <GoogleButton />
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <FieldGroup className="gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                control={form.control}
                name="first_name"
                label="First name"
                autoComplete="given-name"
                placeholder="Juan"
              />
              <TextField
                control={form.control}
                name="last_name"
                label="Last name"
                autoComplete="family-name"
                placeholder="Dela Cruz"
              />
            </div>
            <TextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
            <TextField
              control={form.control}
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              description={`At least ${PASSWORD_MIN_LENGTH} characters.`}
            />
            <TextField
              control={form.control}
              name="password_confirm"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
            />
          </FieldGroup>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton
              pending={pending}
              pendingLabel="Creating account…"
              variant="brand"
              size="lg"
              className="w-full sm:w-auto sm:flex-1"
            >
              Register
            </SubmitButton>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto sm:flex-1">
              <Link href="/">Go to Home</Link>
            </Button>
          </div>
        </form>
      </div>
    </AuthCard>
  );
}
