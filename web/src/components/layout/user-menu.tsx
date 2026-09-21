"use client";

import {
  HomeIcon,
  InfoIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  UserRoundIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useSession, type SessionUser } from "@/lib/auth/session";
import { useLogout } from "@/lib/auth/use-logout";

function initials(user: SessionUser) {
  const letters = `${user.first_name.at(0) ?? ""}${user.last_name.at(0) ?? ""}`;
  return (letters || user.email.at(0) || "?").toUpperCase();
}

/** Login/account button + Menu dropdown, as in the original header. */
export function UserMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const pathname = usePathname();
  const { data: user, isPending } = useSession();
  const { logout, pending: loggingOut } = useLogout();
  const loginHref =
    pathname && pathname !== "/" ? `/login?next=${encodeURIComponent(pathname)}` : "/login";
  const onAccountPage = pathname?.startsWith("/account");

  return (
    <div className="flex items-center gap-2">
      {isPending ? (
        <Skeleton className="hidden h-12 w-36 rounded-full sm:block" aria-hidden="true" />
      ) : user && onAccountPage ? (
        <Button asChild variant="outline" className="hidden h-12 px-5 sm:inline-flex">
          <Link href="/">
            <HomeIcon data-icon="inline-start" />
            Go to homepage
          </Link>
        </Button>
      ) : user ? (
        <Button
          asChild
          variant="outline"
          className="hidden h-12 gap-2.5 pr-5 pl-1.5 sm:inline-flex"
        >
          <Link href="/account">
            <Avatar className="size-9">
              <AvatarFallback className="bg-brand text-xs font-semibold text-brand-foreground">
                {initials(user)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline">Welcome, {user.display_name}</span>
            <span className="lg:hidden">Account</span>
          </Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="hidden h-12 px-5 sm:inline-flex">
          <Link href={loginHref}>
            <UserIcon data-icon="inline-start" />
            Login
          </Link>
        </Button>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-12 px-5">
            <MenuIcon data-icon="inline-start" />
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-60">
          {user ? (
            <>
              <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2 font-normal">
                <span className="font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <span className="truncate text-muted-foreground">{user.email}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/account">
                    <UserRoundIcon />
                    My account
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </>
          ) : null}
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setTheme(isDark ? "light" : "dark")}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              {isDark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">
                <InfoIcon />
                About TrailVenture
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {user ? (
              <DropdownMenuItem
                disabled={loggingOut}
                onSelect={(event) => {
                  event.preventDefault();
                  void logout();
                }}
              >
                {loggingOut ? <Spinner /> : <LogOutIcon />}
                {loggingOut ? "Logging out…" : "Logout"}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem asChild>
                <Link href={loginHref}>
                  <LogInIcon />
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
