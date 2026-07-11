export type JobSource = 'linkedin' | 'generic';

export interface DetectedJob {
  id?: string;
  title: string;
  company: string;
  sourceCompany?: string;
  location?: string;
  specificLocation?: string;
  salary?: string;
  description?: string;
  employmentType?: string;
  workplaceType?: string;
  experience?: string;
  skills?: string[];
  postedAt?: string;
  applicationDeadline?: string;
  applicants?: number;
  jobUrl: string;
  applyUrl?: string;
  logoUrl?: string;
  easyApply?: boolean;
  source: JobSource;
  sourceHost: string;
  confidence: number;
  detectedAt: string;
}
