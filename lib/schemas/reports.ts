import { ReportStatus } from '@/types/report-status';
import { z } from 'zod';

export const reportSchema = z.object({
  name: z.string().min(1),
  status: z.enum(ReportStatus)
});

export type ReportSchema = z.infer<typeof reportSchema>;
