import { NotFoundContent } from "@/components/app/not-found-content";

/** Rendered inside the site layout, which already provides the header and footer. */
export default function PackageNotFound() {
  return (
    <NotFoundContent
      title="We couldn’t find that package"
      description="It may have been removed, or the link might be mistyped."
    />
  );
}
