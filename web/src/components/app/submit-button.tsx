import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/** A form submit button that shows a spinner and blocks double submits while pending. */
export function SubmitButton({
  pending,
  pendingLabel,
  children,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & { pending: boolean; pendingLabel?: string }) {
  return (
    <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props}>
      {pending ? <Spinner data-icon="inline-start" /> : null}
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
