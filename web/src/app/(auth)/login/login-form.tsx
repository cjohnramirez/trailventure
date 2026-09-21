"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { SubmitButton } from "@/components/app/submit-button";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { GoogleButton } from "@/components/auth/google-button";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { allauth } from "@/lib/auth/allauth";
import { safeNextPath } from "@/lib/auth/redirects";
import { loginSchema, type LoginValues } from "@/lib/auth/schemas";
import { useRefreshSession } from "@/lib/auth/session";
import { useAuthSubmit } from "@/lib/auth/use-auth-form";

const SOCIAL_ERROR = "Google sign-in didn’t finish. Try again, or log in with your email.";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNextPath(searchParams.get("next"));
  const refreshSession = useRefreshSession();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const { run, pending, formError } = useAuthSubmit(form);

  const onSubmit = (values: LoginValues) =>
    run(
      () => allauth.login(values.email, values.password),
      async (result) => {
        if (result.kind === "pending" && result.flow === "verify_email") {
          toast.info("Verify your email to finish logging in. We sent you a code.");
          router.push(`/verify-email?next=${encodeURIComponent(next)}`);
          return;
        }
        if (result.kind === "authenticated") {
          await refreshSession();
          toast.success("Welcome back!");
          router.replace(next);
          router.refresh();
        }
      },
    );

  return (
    <AuthCard
      title="Login to Proceed"
      description={
        <>
          Don’t have an account?{" "}
          <AuthLink href={`/register?next=${encodeURIComponent(next)}`}>Register</AuthLink>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <FormAlert
          message={formError ?? (searchParams.get("error") === "social" ? SOCIAL_ERROR : null)}
        />
        <GoogleButton />
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
          <FieldGroup className="gap-5">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input
                    {...field}
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={fieldState.invalid}
                    className="h-11"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    {...field}
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    aria-invalid={fieldState.invalid}
                    className="h-11"
                  />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />
          </FieldGroup>
          <div className="flex flex-col gap-3 sm:flex-row">
            <SubmitButton
              pending={pending}
              pendingLabel="Logging in…"
              variant="brand"
              size="lg"
              className="w-full sm:w-auto sm:flex-1"
            >
              Login
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
