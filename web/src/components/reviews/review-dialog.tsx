"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";

import { RatingInput } from "@/components/reviews/rating-input";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { ApiError } from "@/lib/api/client";
import type { Booking } from "@/lib/bookings/types";
import { createReview } from "@/lib/reviews/api";

const MAX_COMMENT = 2000;

/** Writes the one review a completed booking is allowed. */
export function ReviewDialog({
  booking,
  trigger,
}: {
  booking: Pick<Booking, "id" | "package" | "tier">;
  trigger: React.ReactNode;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const submit = useMutation({
    mutationFn: () => createReview({ booking: booking.id, rating, comment }),
    onSuccess: () => {
      setOpen(false);
      setRating(0);
      setComment("");
      toast.success("Thanks for the review!");
      void queryClient.invalidateQueries({ queryKey: ["bookings"] });
      void queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // The package page renders its reviews on the server.
      router.refresh();
    },
    onError: (cause) => {
      const message =
        cause instanceof ApiError ? cause.message : "We couldn’t save your review. Try again.";
      setError(message);
      toast.error(message);
    },
  });

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!rating) {
      setError("Choose a score from one to five stars.");
      return;
    }
    setError(null);
    submit.mutate();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setError(null);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <DialogHeader>
            <DialogTitle>Review {booking.package.name}</DialogTitle>
            <DialogDescription>
              You travelled on the {booking.tier.name} package. Tell other travelers how it went.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field data-invalid={Boolean(error) && !rating}>
              <FieldLabel htmlFor="review-rating">Your rating</FieldLabel>
              <RatingInput id="review-rating" value={rating} onChange={setRating} />
            </Field>
            <Field>
              <FieldLabel htmlFor="review-comment">Your review</FieldLabel>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value.slice(0, MAX_COMMENT))}
                rows={5}
                placeholder="What stood out? What should the next traveler know?"
              />
              <FieldDescription>
                Optional. {MAX_COMMENT - comment.length} characters left.
              </FieldDescription>
            </Field>
          </FieldGroup>

          {error ? <p className="type-ui text-destructive">{error}</p> : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant="brand"
              disabled={submit.isPending}
              aria-busy={submit.isPending}
            >
              {submit.isPending ? <Spinner data-icon="inline-start" /> : null}
              {submit.isPending ? "Posting…" : "Post review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
