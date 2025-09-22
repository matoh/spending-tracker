import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';

interface PaginationWrapperProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  maxVisiblePages?: number;
  className?: string;
}

export function PaginationWrapper({ currentPage, totalPages, baseUrl, maxVisiblePages = 5, className = 'mt-6' }: PaginationWrapperProps) {
  // Don't render if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={className}>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={hasPrevPage ? `${baseUrl}?page=${currentPage - 1}` : undefined}
              className={!hasPrevPage ? 'pointer-events-none opacity-50' : ''}
              size='default'
            />
          </PaginationItem>

          {pageNumbers.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href={`${baseUrl}?page=${page}`} isActive={page === currentPage} size='icon'>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href={hasNextPage ? `${baseUrl}?page=${currentPage + 1}` : undefined}
              className={!hasNextPage ? 'pointer-events-none opacity-50' : ''}
              size='default'
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
