import React from "react";
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type AppPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseHref?: string; // e.g. "/dashboard?status=all&page="
  siblings?: number; // pages to show on each side of current
  className?: string;
};

function buildHref(baseHref: string | undefined, page: number): string | undefined {
  if (!baseHref) return undefined;
  return `${baseHref}${page}`;
}

function getPageRange(current: number, total: number, siblings: number): (number | "ellipsis-start" | "ellipsis-end")[] {
  const range: (number | "ellipsis-start" | "ellipsis-end")[] = [];
  const firstPage = 1;
  const lastPage = Math.max(1, total);
  const start = Math.max(firstPage, current - siblings);
  const end = Math.min(lastPage, current + siblings);

  // Always include first
  range.push(firstPage);

  if (start > firstPage + 1) {
    range.push("ellipsis-start");
  }

  for (let p = start; p <= end; p++) {
    if (p !== firstPage && p !== lastPage) {
      range.push(p);
    }
  }

  if (end < lastPage - 1) {
    range.push("ellipsis-end");
  }

  if (lastPage !== firstPage) {
    range.push(lastPage);
  }

  return range;
}

export default function AppPagination({
  page,
  totalPages,
  onPageChange,
  baseHref,
  siblings = 1,
  className,
}: AppPaginationProps) {
  if (!totalPages || totalPages <= 1) return null;

  const currentPage = Math.min(Math.max(1, page || 1), totalPages);
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;
  const items = getPageRange(currentPage, totalPages, siblings);

  const handleChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    onPageChange?.(nextPage);
  };

  return (
    <UIPagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={canPrev ? buildHref(baseHref, currentPage - 1) : undefined}
            onClick={(e) => {
              if (!canPrev) return;
              if (!baseHref) {
                e.preventDefault();
                handleChange(currentPage - 1);
              }
            }}
            className={!canPrev ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {items.map((it, idx) => {
          if (it === "ellipsis-start" || it === "ellipsis-end") {
            return (
              <PaginationItem key={`${it}-${idx}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
          const p = it as number;
          const isActive = p === currentPage;
          return (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={isActive}
                href={!isActive ? buildHref(baseHref, p) : undefined}
                onClick={(e) => {
                  if (isActive) return;
                  if (!baseHref) {
                    e.preventDefault();
                    handleChange(p);
                  }
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            href={canNext ? buildHref(baseHref, currentPage + 1) : undefined}
            onClick={(e) => {
              if (!canNext) return;
              if (!baseHref) {
                e.preventDefault();
                handleChange(currentPage + 1);
              }
            }}
            className={!canNext ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}

