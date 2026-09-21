import { NotFoundContent } from "@/components/app/not-found-content";
import { SiteShell } from "@/components/layout/site-shell";

/** Unmatched URLs render outside any layout group, so this page brings its own shell. */
export default function NotFound() {
  return (
    <SiteShell>
      <NotFoundContent />
    </SiteShell>
  );
}
