import { Button } from "@/components/ui/button";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "description", label: "Description" },
  { id: "package-type", label: "Package Type" },
  { id: "reviews", label: "Reviews" },
];

/** The original floating section pill at the bottom of the package page (large screens). */
export function SectionNav() {
  return (
    <nav
      aria-label="Package sections"
      className="fixed inset-x-0 bottom-5 z-20 hidden justify-center px-4 lg:flex"
    >
      <ul className="flex gap-1 rounded-full border bg-background p-1.5">
        {SECTIONS.map((section) => (
          <li key={section.id}>
            <Button asChild variant="ghost" size="sm">
              <a href={`#${section.id}`}>{section.label}</a>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
