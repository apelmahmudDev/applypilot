import { useCallback, useEffect, useRef, useState } from "react";

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
	const detectionRequestRef = useRef(0);
	const [job, setJob] = useState<JobForm>(fallbackJob);
	const [state, setState] = useState<DetectionState>({
		isDetecting: true,
		error: "",
		confidence: null,
	});

	const detect = useCallback(async () => {
		const requestId = detectionRequestRef.current + 1;
		detectionRequestRef.current = requestId;

		setState((currentState) => ({
			...currentState,
			isDetecting: true,
			error: "",
		}));

		try {
			const detectedJob = await detectJobFromActiveTab();

			if (detectionRequestRef.current !== requestId) return;

			if (!detectedJob) {
				setJob(fallbackJob);
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
			if (detectionRequestRef.current !== requestId) return;

			setJob(fallbackJob);
			setState({
				isDetecting: false,
				error: "Could not auto-detect this page. You can still edit manually.",
				confidence: null,
			});
		}
	}, [fallbackJob]);

	useEffect(() => {
		void detect();
	}, [detect]);

	useEffect(() => {
		let timeoutIds: Array<ReturnType<typeof setTimeout>> = [];

		const clearScheduledDetections = () => {
			for (const timeoutId of timeoutIds) {
				clearTimeout(timeoutId);
			}
			timeoutIds = [];
		};

		const scheduleDetection = (delay = 500) => {
			const timeoutId = setTimeout(() => {
				void detect();
			}, delay);
			timeoutIds.push(timeoutId);
		};

		const handleTabUpdated: Parameters<typeof browser.tabs.onUpdated.addListener>[0] = (
			_tabId,
			changeInfo,
			tab,
		) => {
			if (!tab.active) return;
			if (!changeInfo.url && changeInfo.status !== "complete") return;

			clearScheduledDetections();
			scheduleDetection(changeInfo.url ? 350 : 250);

			if (changeInfo.url) {
				scheduleDetection(1400);
			}
		};

		const handleTabActivated: Parameters<
			typeof browser.tabs.onActivated.addListener
		>[0] = () => {
			clearScheduledDetections();
			scheduleDetection(250);
		};

		browser.tabs.onUpdated.addListener(handleTabUpdated);
		browser.tabs.onActivated.addListener(handleTabActivated);

		return () => {
			clearScheduledDetections();

			browser.tabs.onUpdated.removeListener(handleTabUpdated);
			browser.tabs.onActivated.removeListener(handleTabActivated);
		};
	}, [detect]);

	return {
		job,
		setJob,
		...state,
	};
}
