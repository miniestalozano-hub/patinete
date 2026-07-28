import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}

function buildHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v && k !== "page") usp.set(k, v);
  });
  if (page > 1) usp.set("page", String(page));
  const qs = usp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ currentPage, totalPages, basePath, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Paginacion">
      {pages.map((page, idx) => (
        <div key={page} className="flex items-center gap-2">
          {idx > 0 && pages[idx - 1] !== page - 1 && <span className="text-brand-gray-300">…</span>}
          <Link
            href={buildHref(basePath, searchParams, page)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
              page === currentPage
                ? "bg-brand-black text-white"
                : "text-brand-gray-600 hover:bg-brand-gray-100"
            )}
          >
            {page}
          </Link>
        </div>
      ))}
    </nav>
  );
}
