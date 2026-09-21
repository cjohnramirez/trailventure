import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ReviewStars } from "@/components/reviews/review-stars";
import { formatApiDate } from "@/lib/format";
import type { Review } from "@/lib/reviews/types";

function initials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

/** The original review card: author and score on one line, the comment, then the date. */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="flex flex-col gap-3 rounded-xl border p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar className="size-9">
            <AvatarImage src={review.author.avatar_url || undefined} alt="" />
            <AvatarFallback>{initials(review.author.name)}</AvatarFallback>
          </Avatar>
          <span className="type-ui font-medium">{review.author.name}</span>
        </div>
        <ReviewStars rating={review.rating} />
      </div>
      {review.comment ? <p className="type-body text-pretty">{review.comment}</p> : null}
      <p className="type-caption text-muted-foreground sm:self-end">
        {formatApiDate(review.created_at.slice(0, 10))}
      </p>
    </article>
  );
}
