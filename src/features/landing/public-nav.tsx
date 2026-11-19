import { Link } from "@tanstack/react-router";

import { Logo } from "@/components/common/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" aria-label="Home">
          <Logo />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#how-it-works" className="hover:text-foreground">How it works</a>
          <a href="#benefits" className="hover:text-foreground">Benefits</a>
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link to="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}