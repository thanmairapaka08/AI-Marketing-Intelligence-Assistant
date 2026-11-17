import { useNavigate } from "@tanstack/react-router";
import { LogOut, Settings } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { displayName, initials, useAuth } from "@/features/auth/auth-context";

export function useLogout() {
  const { logout, status } = useAuth();
  const navigate = useNavigate();
  return async () => {
    const wasPreview = status === "preview";
    await logout();
    toast.success(wasPreview ? "Left explore mode" : "Signed out");
    void navigate({ to: "/login", search: {} });
  };
}

export function UserMenu() {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const handleLogout = useLogout();
  const name = status === "preview" ? "Explore mode" : displayName(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 px-1.5" aria-label="Account menu">
          <Avatar className="size-7">
            <AvatarFallback className="bg-primary-soft text-xs font-medium text-primary">
              {status === "preview" ? "EX" : initials(user)}
            </AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[140px] truncate text-sm font-medium md:inline">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="truncate text-sm font-medium">{name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {status === "preview" ? "Backend not connected" : user?.email}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void navigate({ to: "/settings" })}>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => void handleLogout()}>
          <LogOut /> {status === "preview" ? "Exit explore mode" : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
