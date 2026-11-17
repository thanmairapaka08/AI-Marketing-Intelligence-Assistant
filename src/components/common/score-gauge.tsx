import { cn } from "@/lib/utils";
import { classifyScore, normalizeScore, scoreBandStroke, scoreBandText } from "@/utils/score";

/** Circular score gauge. A missing score renders as "Unavailable", never as 0. */
export function ScoreGauge({
  score,
  size = 160,
  strokeWidth = 12,
  showLabel = true,
  className,
}: {
  score: number | null | undefined;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
}) {
  const value = normalizeScore(score);
  const { band, label } = classifyScore(value);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = value === null ? circumference : circumference * (1 - value / 100);

  return (
    <div
      className={cn("relative inline-grid place-items-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={value === null ? "SEO score unavailable" : `SEO score ${Math.round(value)} out of 100, ${label}`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn(scoreBandStroke[band], "transition-[stroke-dashoffset] duration-700 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={cn(
            "font-semibold tracking-tight tabular",
            value === null ? "text-muted-foreground" : "text-foreground",
          )}
          style={{ fontSize: value === null ? size * 0.12 : size * 0.28 }}
        >
          {value === null ? "N/A" : Math.round(value)}
        </span>
        {showLabel && (
          <span className={cn("text-xs font-medium", scoreBandText[band])}>
            {value === null ? "Unavailable" : `${label} · /100`}
          </span>
        )}
      </div>
    </div>
  );
}
