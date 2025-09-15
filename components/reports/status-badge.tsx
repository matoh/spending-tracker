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

  const getStatusColor = (status: ReportStatusType) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return '';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className={cn(getStatusColor(status), className)}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
