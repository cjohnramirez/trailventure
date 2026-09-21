"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

/** Six-digit one-time code input bound to react-hook-form. */
export function CodeField<T extends FieldValues>({
  control,
  name,
  label,
  onComplete,
}: {
  control: Control<T>;
  name: Path<T>;
  label: string;
  onComplete?: () => void;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className="items-center">
          <FieldLabel htmlFor="field-code" className="self-center">
            {label}
          </FieldLabel>
          <InputOTP
            id="field-code"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            onComplete={onComplete}
            aria-invalid={fieldState.invalid}
            containerClassName="justify-center"
          >
            <InputOTPGroup className="*:data-[slot=input-otp-slot]:size-12 *:data-[slot=input-otp-slot]:text-lg">
              {Array.from({ length: 6 }, (_, index) => (
                <InputOTPSlot key={index} index={index} />
              ))}
            </InputOTPGroup>
          </InputOTP>
          <FieldError errors={[fieldState.error]} className="text-center" />
        </Field>
      )}
    />
  );
}
