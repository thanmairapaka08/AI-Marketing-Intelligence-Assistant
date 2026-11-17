import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { AffectedPage } from "@/services/types";

export function UrlList({ urls, max = 5 }: { urls: (string | AffectedPage)[] | undefined; max?: number }) {
  const [expanded, setExpanded] = useState(false);
  if (!urls || urls.length === 0) return <p className="text-sm text-muted-foreground">No affected URLs reported.</p>;
  const visible = expanded ? urls : urls.slice(0, max);
  return (
    <div>
      <ul className="divide-y rounded-lg border bg-surface/40">
        {visible.map((item, index) => {
          const url = typeof item === "string" ? item : item.url;
          const note = typeof item === "string" ? null : (item.issue ?? item.detail);
          return (
            <li key={`${url}-${index}`} className="flex items-start justify-between gap-3 px-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-mono text-xs">{url}</p>
                {note && <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>}
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                aria-label={`Open ${url} in a new tab`}
              >
                <ExternalLink className="size-3.5" />
              </a>
            </li>
          );
        })}
      </ul>
      {urls.length > max && (
        <Button variant="link" size="sm" className="mt-1 h-auto px-0" onClick={() => setExpanded((v) => !v)}>
          {expanded ? "Show fewer" : `Show all ${urls.length} URLs`}
        </Button>
      )}
    </div>
  );
}
