import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);
  return { page, setPage, pageCount, pageItems, total: items.length, pageSize };
}

export function PaginationControls({
  page,
  pageCount,
  total,
  pageSize,
  setPage,
}: {
  page: number;
  pageCount: number;
  total: number;
  pageSize: number;
  setPage: (page: number) => void;
}) {
  if (total <= pageSize) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);
  return (
    <nav className="flex items-center justify-between gap-3 border-t px-4 py-3 text-sm" aria-label="Pagination">
      <p className="text-muted-foreground tabular">
        {start}–{end} of {total}
      </p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft />
        </Button>
        <span className="px-2 tabular text-muted-foreground">
          {page} / {pageCount}
        </span>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page >= pageCount} aria-label="Next page">
          <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
