import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { ScoreBadge, StatusBadge } from "@/components/common/badges";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AuditSummary } from "@/services/types";
import { formatDate, formatNumber } from "@/utils/format";
import { getDomain } from "@/utils/url";

import { auditId, auditScore } from "./hooks";

export function AuditsTable({ audits, showPages = true }: { audits: AuditSummary[]; showPages?: boolean }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Website</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Score</TableHead>
            {showPages && <TableHead className="text-right">Pages</TableHead>}
            <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.map((audit, index) => {
            const id = auditId(audit);
            return (
              <TableRow key={id ?? index}>
                <TableCell className="max-w-[240px] truncate font-medium">{audit.domain ?? getDomain(audit.url) ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground tabular">{formatDate(audit.created_at)}</TableCell>
                <TableCell><StatusBadge status={audit.status} /></TableCell>
                <TableCell><ScoreBadge score={auditScore(audit)} /></TableCell>
                {showPages && <TableCell className="text-right tabular">{formatNumber(audit.pages_crawled)}</TableCell>}
                <TableCell>
                  {id && (
                    <Link
                      to="/audits/$id"
                      params={{ id }}
                      className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
                      aria-label={`View report for ${audit.url ?? "audit"}`}
                    >
                      <ArrowUpRight className="size-4" />
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
