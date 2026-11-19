import { createFileRoute } from "@tanstack/react-router";
import { Globe, Loader2, LogOut, Moon, Sun, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/features/auth/auth-context";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Profile, theme, session and backend connection." },
      { property: "og:title", content: "Settings — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Profile, theme, session and backend connection." },
    ],
  }),
  component: () => <SettingsPage />,
});

function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account, theme, and backend connection."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="size-4" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="full-name">Full Name</Label>
              <Input
                id="full-name"
                value={user?.full_name ?? user?.name ?? ""}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="bg-muted"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="size-4" /> Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground">
            Current: {theme === "system" ? "System preference" : theme}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="size-4" /> Backend Connection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The frontend connects to the FastAPI backend via the <code>VITE_API_BASE_URL</code>
            environment variable. Current: <code className="text-xs">/api/v1</code>
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Loader2 className="mr-2 size-4" /> Check Connection
            </Button>
            <span className="text-sm text-success">Connected</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="size-4" /> Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="destructive" onClick={logout}>
            <LogOut className="mr-2 size-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}