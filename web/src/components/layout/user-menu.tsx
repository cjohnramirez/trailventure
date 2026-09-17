"use client";

import { InfoIcon, LogInIcon, MenuIcon, MoonIcon, SunIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/** Login button + Menu dropdown, as in the original header. Signed-in states arrive with auth (M3). */
export function UserMenu() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <div className="flex items-center gap-2">
      <Button asChild variant="outline" className="hidden h-12 px-5 sm:inline-flex">
        <Link href="/login">
          <UserIcon data-icon="inline-start" />
          Login
        </Link>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-12 px-5">
            <MenuIcon data-icon="inline-start" />
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setTheme(isDark ? "light" : "dark")}>
              {isDark ? <SunIcon /> : <MoonIcon />}
              {isDark ? "Light mode" : "Dark mode"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogInIcon />
                Login
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/about">
                <InfoIcon />
                About TrailVenture
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
