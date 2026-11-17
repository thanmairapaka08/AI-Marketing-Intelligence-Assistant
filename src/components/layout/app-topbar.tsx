import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Menu } from "lucide-react";

import { Button } from "@/components/ui/button";

import { describePath } from "./nav-items";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function AppTopbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { title, crumbs } = describePath(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onOpenMobileNav} aria-label="Open navigation">
        <Menu />
      </Button>
      <div className="min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
          <Link to="/dashboard" className="hover:text-foreground">
            Workspace
          </Link>
          {crumbs.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5">
              <ChevronRight className="size-3.5" aria-hidden />
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-foreground">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </span>
          ))}
        </nav>
        <p className="truncate text-sm font-medium sm:hidden">{title}</p>
      </div>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
