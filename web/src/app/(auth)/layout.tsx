import { Logo } from "@/components/brand/logo";

/** Standalone auth pages, like the original: a centered card without the site header. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main
      id="main"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-4 py-10 sm:px-8"
    >
      <Logo />
      {children}
      <p className="max-w-md text-center text-xs text-muted-foreground">
        TrailVenture is an early-access portfolio project. Trips are demo data and payments run in
        Stripe test mode.
      </p>
    </main>
  );
}
