"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SubmitButton } from "@/components/app/submit-button";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { CodeField } from "@/components/auth/code-field";
import { FormAlert } from "@/components/auth/form-alert";
import { ResendButton } from "@/components/auth/resend-button";
import { TextField } from "@/components/auth/text-field";
import { FieldGroup } from "@/components/ui/field";
import { allauth } from "@/lib/auth/allauth";
import {
  PASSWORD_MIN_LENGTH,
  resetPasswordSchema,
  type ResetPasswordValues,
} from "@/lib/auth/schemas";
import { useRefreshSession } from "@/lib/auth/session";
import { useAuthSubmit } from "@/lib/auth/use-auth-form";

const noopSubscribe = () => () => {};

function readResetEmail(): string | null {
  try {
    return sessionStorage.getItem("tv-reset-email");
  } catch {
    return null;
  }
}

export function ResetPasswordForm() {
  const router = useRouter();
  const refreshSession = useRefreshSession();
  const email = React.useSyncExternalStore(noopSubscribe, readResetEmail, () => null);

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { code: "", password: "", password_confirm: "" },
  });
  const { run, pending, formError } = useAuthSubmit(form);

  const onSubmit = (values: ResetPasswordValues) =>
    run(
      () => allauth.resetPassword(values.code, values.password),
      async (result) => {
        try {
          sessionStorage.removeItem("tv-reset-email");
        } catch {
          // Nothing to clean up.
        }
        if (result.kind === "authenticated") {
          await refreshSession();
          toast.success("Password updated. You’re logged in.");
          router.replace("/");
          router.refresh();
          return;
        }
        toast.success("Password updated. Log in with your new password.");
        router.replace("/login");
      },
      { key: "code" },
    );

  return (
    <AuthCard
      title="Reset your password"
      description={
        email
          ? `If ${email} has an account, we sent it a 6-digit code.`
          : "Enter the 6-digit code from your email and choose a new password."
      }
      footer={
        <>
          Wrong email? <AuthLink href="/forgot-password">Start over</AuthLink>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <FormAlert message={formError} />
        <FieldGroup className="gap-5">
          <CodeField control={form.control} name="code" label="Reset code" />
          <TextField
            control={form.control}
            name="password"
            label="New password"
            type="password"
            autoComplete="new-password"
            description={`At least ${PASSWORD_MIN_LENGTH} characters.`}
          />
          <TextField
            control={form.control}
            name="password_confirm"
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
          />
        </FieldGroup>
        <SubmitButton pending={pending} pendingLabel="Updating password…" variant="brand" size="lg">
          Update password
        </SubmitButton>
        {email ? (
          <div className="flex justify-center text-sm">
            <ResendButton resend={() => allauth.requestPasswordReset(email)} />
          </div>
        ) : null}
      </form>
    </AuthCard>
  );
}
