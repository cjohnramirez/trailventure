"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PencilIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import type { Account } from "@/lib/account/types";
import { useUpdateAccount } from "@/lib/account/use-account";

const optionalUrl = z.union([z.literal(""), z.url("Enter a full URL, starting with https://")]);

const schema = z.object({
  first_name: z.string().trim().max(150),
  last_name: z.string().trim().max(150),
  phone: z.string().trim().max(32),
  date_of_birth: z.union([z.literal(""), z.iso.date("Use the date picker.")]),
  bio: z.string().trim().max(500),
  facebook_url: optionalUrl,
  x_url: optionalUrl,
  instagram_url: optionalUrl,
});

type Values = z.infer<typeof schema>;

/** Edits the details the original user page could only display — its modify endpoint never worked. */
export function ProfileDialog({ account }: { account: Account }) {
  const [open, setOpen] = React.useState(false);
  const update = useUpdateAccount();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    values: {
      first_name: account.first_name,
      last_name: account.last_name,
      phone: account.profile.phone,
      date_of_birth: account.profile.date_of_birth ?? "",
      bio: account.profile.bio,
      facebook_url: account.profile.facebook_url,
      x_url: account.profile.x_url,
      instagram_url: account.profile.instagram_url,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    update.mutate(
      {
        first_name: values.first_name,
        last_name: values.last_name,
        profile: {
          phone: values.phone,
          date_of_birth: values.date_of_birth || null,
          bio: values.bio,
          facebook_url: values.facebook_url,
          x_url: values.x_url,
          instagram_url: values.instagram_url,
        },
      },
      {
        onSuccess: () => {
          setOpen(false);
          toast.success("Profile updated.");
        },
        onError: (cause) =>
          toast.error(
            cause instanceof ApiError ? cause.message : "We couldn’t save your profile. Try again.",
          ),
      },
    );
  });

  const text = (
    name: keyof Values,
    label: string,
    props: React.ComponentProps<typeof Input> = {},
  ) => (
    <Field data-invalid={Boolean(form.formState.errors[name])}>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <Input
        id={name}
        aria-invalid={Boolean(form.formState.errors[name])}
        {...props}
        {...form.register(name)}
      />
      {form.formState.errors[name] ? (
        <FieldDescription className="text-destructive">
          {form.formState.errors[name]?.message}
        </FieldDescription>
      ) : null}
    </Field>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <PencilIcon data-icon="inline-start" />
          Edit profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Edit your profile</DialogTitle>
            <DialogDescription>
              Your email address is managed from the login settings and can’t be changed here.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              {text("first_name", "First name", { autoComplete: "given-name" })}
              {text("last_name", "Last name", { autoComplete: "family-name" })}
              {text("phone", "Phone", { autoComplete: "tel", placeholder: "+63 917 123 4567" })}
              {text("date_of_birth", "Date of birth", { type: "date" })}
            </div>
            <Field>
              <FieldLabel htmlFor="bio">About you</FieldLabel>
              <Textarea id="bio" rows={3} maxLength={500} {...form.register("bio")} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              {text("facebook_url", "Facebook", { placeholder: "https://facebook.com/…" })}
              {text("x_url", "X", { placeholder: "https://x.com/…" })}
              {text("instagram_url", "Instagram", { placeholder: "https://instagram.com/…" })}
            </div>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="brand"
              disabled={update.isPending}
              aria-busy={update.isPending}
            >
              {update.isPending ? <Spinner data-icon="inline-start" /> : null}
              {update.isPending ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
