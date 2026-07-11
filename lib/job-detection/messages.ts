import type { DetectedJob } from "@/lib/job-detection/types";

export type JobDetectorMessage =
	| { type: "APPLYPILOT_GET_JOB" }
	| { type: "APPLYPILOT_JOB_CHANGED"; job: DetectedJob | null };
