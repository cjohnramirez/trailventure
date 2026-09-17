"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { SubmitButton } from "@/components/app/submit-button";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { FormAlert } from "@/components/auth/form-alert";
import { TextField } from "@/components/auth/text-field";
import { FieldGroup } from "@/components/ui/field";
import { allauth } from "@/lib/auth/allauth";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/auth/schemas";
import { useAuthSubmit } from "@/lib/auth/use-auth-form";

export function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const { run, pending, formError } = useAuthSubmit(form);

  const onSubmit = (values: ForgotPasswordValues) =>
    run(
      () => allauth.requestPasswordReset(values.email),
      () => {
        // The server answers the same way whether or not the email has an account.
        sessionStorage.setItem("tv-reset-email", values.email);
        router.push("/reset-password");
      },
    );

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your account email and we’ll send you a 6-digit code to reset it."
      footer={
        <>
          Remembered it? <AuthLink href="/login">Back to login</AuthLink>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <FormAlert message={formError} />
        <FieldGroup>
          <TextField
            control={form.control}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
        </FieldGroup>
        <SubmitButton pending={pending} pendingLabel="Sending code…" variant="brand" size="lg">
          Send reset code
        </SubmitButton>
      </form>
    </AuthCard>
  );
}
