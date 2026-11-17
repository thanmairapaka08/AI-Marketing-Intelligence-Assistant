import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground shadow-card",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18 L9.5 11 L13.5 14.5 L20 6" />
        <circle cx="20" cy="6" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="text-[15px] leading-tight font-semibold tracking-tight">
          Marketing<span className="text-muted-foreground font-medium"> Intelligence</span>
        </span>
      )}
    </span>
  );
}
