import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-4xl font-semibold">TrailVenture</h1>
      <p className="max-w-prose text-muted-foreground">
        The rebuild is in progress. The new design system lands next.
      </p>
      <Button asChild>
        <a href="/api/docs/">Browse the API docs</a>
      </Button>
    </main>
  );
}
