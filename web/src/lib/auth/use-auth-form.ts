"use client";

import * as React from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { ApiError } from "@/lib/api/client";
import type { AuthResult } from "@/lib/auth/allauth";

/**
 * Runs an allauth call for a react-hook-form form: maps field errors from the API onto the
 * form, keeps a form-level message, and reports the pending state for the submit button.
 */
export function useAuthSubmit<T extends FieldValues>(form: UseFormReturn<T>) {
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState(false);

  const run = async (
    action: () => Promise<AuthResult>,
    onResult: (result: Exclude<AuthResult, { kind: "error" }>) => void | Promise<void>,
    /** Maps API field names to form field names when they differ. */
    fieldMap: Record<string, Path<T>> = {},
  ) => {
    setFormError(null);
    setPending(true);
    try {
      const result = await action();
      if (result.kind === "error") {
        let unmapped = result.formError;
        for (const [param, message] of Object.entries(result.fieldErrors)) {
          const field = fieldMap[param] ?? (param as Path<T>);
          if (field in form.getValues()) form.setError(field, { message });
          else unmapped ??= message;
        }
        setFormError(unmapped ?? null);
        return;
      }
      await onResult(result);
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setPending(false);
    }
  };

  return { run, pending, formError, setFormError };
}
