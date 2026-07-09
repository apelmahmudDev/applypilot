import { useEffect, useState } from "react";

import { detectJobFromActiveTab } from "@/lib/job-detection/detect-active-tab";
import type { DetectionConfidence } from "@/lib/job-detection/types";
import type { JobForm } from "@/modules/popup/types";

const emptyJob: JobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "Other",
	status: "Interested",
	notes: "",
};

type DetectionState = {
	isDetecting: boolean;
	error: string;
	confidence: DetectionConfidence | null;
};

export function useDetectedJob(fallbackJob: JobForm = emptyJob) {
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
						error: "",
						confidence: null,
					});
					return;
				}

				setJob({
					title: detectedJob.title,
					company: detectedJob.company,
					location: detectedJob.location,
					url: detectedJob.url,
					platform: detectedJob.platform || "Other",
					status: fallbackJob.status,
					notes: detectedJob.description,
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
