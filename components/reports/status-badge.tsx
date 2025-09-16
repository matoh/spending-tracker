import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types/report-status';

type ReportStatusType = (typeof ReportStatus)[number];

interface StatusBadgeProps {
  status: ReportStatusType;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusVariant = (status: ReportStatusType) => {
    switch (status) {
      case 'open':
        return 'default';
      case 'closed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className={cn(className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
