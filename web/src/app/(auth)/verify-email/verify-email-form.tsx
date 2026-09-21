"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { SubmitButton } from "@/components/app/submit-button";
import { AuthCard, AuthLink } from "@/components/auth/auth-card";
import { CodeField } from "@/components/auth/code-field";
import { FormAlert } from "@/components/auth/form-alert";
import { ResendButton } from "@/components/auth/resend-button";
import { allauth } from "@/lib/auth/allauth";
import { safeNextPath } from "@/lib/auth/redirects";
import { codeSchema, type CodeValues } from "@/lib/auth/schemas";
import { useRefreshSession } from "@/lib/auth/session";
import { useAuthSubmit } from "@/lib/auth/use-auth-form";

export function VerifyEmailForm() {
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"));
  const refreshSession = useRefreshSession();

  const form = useForm<CodeValues>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: "" },
  });
  const { run, pending, formError } = useAuthSubmit(form);

  const onSubmit = (values: CodeValues) =>
    run(
      () => allauth.verifyEmail(values.code),
      async (result) => {
        if (result.kind === "authenticated") {
          await refreshSession();
          toast.success("Email verified. You’re all set!");
          router.replace(next);
          router.refresh();
          return;
        }
        toast.success("Email verified. Log in to continue.");
        router.replace(`/login?next=${encodeURIComponent(next)}`);
      },
      { key: "code" },
    );

  return (
    <AuthCard
      title="Verify your email"
      description="We sent a 6-digit code to your email. Enter it below to finish setting up your account."
      footer={
        <>
          Wrong account? <AuthLink href="/login">Log in with a different email</AuthLink>
        </>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        <FormAlert message={formError} />
        <CodeField
          control={form.control}
          name="code"
          label="Verification code"
          onComplete={() => void form.handleSubmit(onSubmit)()}
        />
        <SubmitButton pending={pending} pendingLabel="Verifying…" variant="brand" size="lg">
          Verify email
        </SubmitButton>
        <div className="flex flex-col items-center gap-1 text-sm text-muted-foreground">
          <span>Didn’t get it? Check your spam folder, or</span>
          <ResendButton resend={allauth.resendEmailVerification} />
        </div>
      </form>
    </AuthCard>
  );
}
