import { useEffect, useState } from "react";

import { detectJobFromActiveTab } from "@/lib/job-detection/detect-active-tab";
import type { DetectionConfidence } from "@/lib/job-detection/types";
import type { JobForm } from "@/modules/popup/types";

type DetectionState = {
	isDetecting: boolean;
	error: string;
	confidence: DetectionConfidence | null;
};

export function useDetectedJob(fallbackJob: JobForm) {
	const [job, setJob] = useState<JobForm>(fallbackJob);
	const [state, setState] = useState<DetectionState>({
		isDetecting: true,
		error: "",
		confidence: null,
	});

	useEffect(() => {
		let isMounted = true;

		async function detect() {
			try {
				const detectedJob = await detectJobFromActiveTab();

				if (!isMounted) return;

				if (!detectedJob) {
					setState({
						isDetecting: false,
						error: "Open a job page to auto-detect details.",
						confidence: null,
					});
					return;
				}

				setJob({
					title: detectedJob.title || fallbackJob.title,
					company: detectedJob.company || fallbackJob.company,
					location: detectedJob.location || fallbackJob.location,
					url: detectedJob.url || fallbackJob.url,
					platform: detectedJob.platform || fallbackJob.platform,
					status: fallbackJob.status,
					notes: detectedJob.description || fallbackJob.notes,
				});
				setState({
					isDetecting: false,
					error: "",
					confidence: detectedJob.confidence,
				});
			} catch {
				if (!isMounted) return;

				setState({
					isDetecting: false,
					error: "Could not auto-detect this page. You can still edit manually.",
					confidence: null,
				});
			}
		}

		detect();

		return () => {
			isMounted = false;
		};
	}, [fallbackJob]);

	return {
		job,
		setJob,
		...state,
	};
}
