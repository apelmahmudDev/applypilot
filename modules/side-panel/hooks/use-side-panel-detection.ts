import { useCallback, useEffect, useState } from "react";

import { detectJobFromActiveTab } from "@/lib/job-detection/detect-active-tab";
import type { DetectionConfidence } from "@/lib/job-detection/types";
import type { SidePanelJobForm } from "@/modules/side-panel/types";

type DetectionState = {
	job: SidePanelJobForm | null;
	isDetecting: boolean;
	error: string;
	confidence: DetectionConfidence | null;
};

export function useSidePanelDetection() {
	const [state, setState] = useState<DetectionState>({
		job: null,
		isDetecting: true,
		error: "",
		confidence: null,
	});

	const detect = useCallback(async () => {
		setState((currentState) => ({
			...currentState,
			isDetecting: true,
			error: "",
		}));

		try {
			const detectedJob = await detectJobFromActiveTab();

			if (!detectedJob) {
				setState({
					job: null,
					isDetecting: false,
					error: "",
					confidence: null,
				});
				return;
			}

			setState({
				job: {
					title: detectedJob.title,
					company: detectedJob.company,
					location: detectedJob.location,
					url: detectedJob.url,
					platform: detectedJob.platform || "Other",
					salary: detectedJob.salary,
					status: "Saved",
					deadline: "",
					followUpDate: "",
					recruiterName: "",
					recruiterEmail: "",
					tags: [],
					notes: detectedJob.description,
				},
				isDetecting: false,
				error: "",
				confidence: detectedJob.confidence,
			});
		} catch {
			setState({
				job: null,
				isDetecting: false,
				error: "Could not detect job details on this page.",
				confidence: null,
			});
		}
	}, []);

	useEffect(() => {
		void detect();
	}, [detect]);

	return {
		...state,
		retryDetection: detect,
	};
}
