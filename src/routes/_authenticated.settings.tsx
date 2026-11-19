import { createFileRoute } from "@tanstack/react-router";
import { Globe, Loader2, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/common/page-header";
import { useTheme } from "@/hooks/use-theme";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Marketing Intelligence Assistant" },
      { name: "description", content: "Appearance and backend connection." },
      { property: "og:title", content: "Settings — AI Marketing Intelligence Assistant" },
      { property: "og:description", content: "Appearance and backend connection." },
    ],
  }),
  component: () => <SettingsPage />,
});

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Appearance and backend connection."
      />

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
    </div>
  );
}