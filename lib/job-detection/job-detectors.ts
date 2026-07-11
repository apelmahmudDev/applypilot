export type { JobSource, DetectedJob } from './detectors/types';
export {
  detectLinkedInDetailsJob,
  detectLinkedInJob,
  detectLinkedInSearchJob,
  isLinkedInJobDetailsPage,
} from './detectors/linkedin';
export { detectGenericJob } from './detectors/generic';

import { detectGenericJob } from './detectors/generic';
import { detectLinkedInJob } from './detectors/linkedin';
import { LINKEDIN_HOST_RE } from './detectors/shared';
import type { DetectedJob } from './detectors/types';

export function detectCurrentJob(doc: Document = document): DetectedJob | null {
  return LINKEDIN_HOST_RE.test(window.location.hostname)
    ? detectLinkedInJob(doc)
    : detectGenericJob(doc);
}
