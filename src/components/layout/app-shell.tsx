import { Link } from "@tanstack/react-router";
import { PlugZap } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Logo } from "@/components/common/logo";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/features/auth/auth-context";

import { AppSidebar, SidebarNav } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { status } = useAuth();

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex min-h-screen bg-background">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:shadow-elevated"
        >
          Skip to content
        </a>
        <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-72 bg-sidebar p-0">
            <SheetHeader className="h-14 justify-center border-b px-4">
              <SheetTitle asChild>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Logo />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <div className="px-3 py-5">
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onOpenMobileNav={() => setMobileOpen(true)} />
          {status === "preview" && (
            <div className="flex items-center gap-2 border-b bg-warning-soft px-4 py-2 text-xs text-warning-foreground sm:px-6 dark:text-warning">
              <PlugZap className="size-3.5 shrink-0" aria-hidden />
              <span>
                Explore mode — the backend isn't connected, so every page shows its empty or unavailable state.
              </span>
            </div>
          )}
          <main id="main" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
