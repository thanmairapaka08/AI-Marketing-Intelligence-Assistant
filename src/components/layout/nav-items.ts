import {
  BarChart3,
  FileDown,
  Globe,
  History,
  LayoutDashboard,
  ScanSearch,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  to: "/dashboard" | "/audit" | "/websites" | "/history" | "/competitors" | "/recommendations" | "/reports" | "/settings";
  label: string;
  icon: LucideIcon;
}

export const NAV_SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: "Overview",
    items: [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/audit", label: "New Audit", icon: ScanSearch },
      { to: "/websites", label: "Websites", icon: Globe },
      { to: "/history", label: "Audit History", icon: History },
    ],
  },
  {
    title: "Insights",
    items: [
      { to: "/competitors", label: "Competitor Analysis", icon: BarChart3 },
      { to: "/recommendations", label: "AI Recommendations", icon: Sparkles },
      { to: "/reports", label: "Reports", icon: FileDown },
    ],
  },
  {
    title: "Account",
    items: [{ to: "/settings", label: "Settings", icon: Settings }],
  },
];

export const NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items);

/** Title and breadcrumbs for the top bar, derived from the current path. */
export function describePath(pathname: string): { title: string; crumbs: { label: string; to?: NavItem["to"] }[] } {
  if (pathname.startsWith("/audits/")) {
    return { title: "Audit report", crumbs: [{ label: "Audit History", to: "/history" }, { label: "Audit report" }] };
  }
  const item = NAV_ITEMS.find((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));
  return { title: item?.label ?? "Dashboard", crumbs: [{ label: item?.label ?? "Dashboard" }] };
}
