import { useEffect, useState } from "react";

import { analyzeJobUrl, isJobAnalysisAvailable } from "@/lib/job-analysis/service";
import { useJobDetector } from "@/lib/job-detection/use-job-detector";
import type { SidePanelJobForm } from "@/modules/side-panel/types";

const emptyDetectedJob: SidePanelJobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "Other",
	salary: "",
	reminderType: "Follow up",
	status: "Saved",
	deadline: "",
	followUpDate: "",
	followUpTime: "",
	reminderNote: "",
	reminderEnabled: false,
	reminderDone: false,
	notes: "",
};

export function useSidePanelDetection() {
	const detector = useJobDetector();
	const [job, setJob] = useState<SidePanelJobForm | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);

	useEffect(() => {
		if (!detector.job) {
			setJob(null);
			return;
		}

		setJob({
			...emptyDetectedJob,
			title: detector.job.title ?? "",
			company: detector.job.company ?? "",
			location: detector.job.location ?? "",
			url: detector.job.url ?? "",
			platform: detector.job.platform || "Other",
			salary: detector.job.salary ?? "",
			logoUrl: detector.job.logoUrl ?? "",
			employmentType: detector.job.employmentType ?? "",
			workplaceType: detector.job.workplaceType ?? "",
			descriptionText: detector.job.descriptionText ?? "",
			descriptionHtml: detector.job.descriptionHtml ?? "",
			notes: detector.job.descriptionText ?? "",
		});
	}, [detector.job]);

	return {
		job,
		setJob,
		isDetecting: detector.isDetecting,
		isAnalyzing,
		isAnalysisAvailable: isJobAnalysisAvailable(),
		error: detector.error,
		confidence: detector.job?.confidence ?? null,
		retryDetection: detector.retryDetection,
		analyzeCurrentJob: async () => {
			setIsAnalyzing(true);
			try {
				const [activeTab] = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});
				const analyzedJob = await analyzeJobUrl(activeTab?.url ?? job?.url ?? "");
				const nextJob: SidePanelJobForm = {
					...(job ?? emptyDetectedJob),
					title: analyzedJob.title || job?.title || "",
					company: analyzedJob.company || job?.company || "",
					location: analyzedJob.location || job?.location || "",
					url: analyzedJob.url || job?.url || "",
					salary: analyzedJob.salary || job?.salary || "",
					employmentType: analyzedJob.employmentType || job?.employmentType,
					workplaceType: analyzedJob.workplaceType || job?.workplaceType,
					descriptionText: analyzedJob.descriptionText || job?.descriptionText,
					notes: analyzedJob.descriptionText || job?.notes || "",
				};
				setJob(nextJob);
				return nextJob;
			} finally {
				setIsAnalyzing(false);
			}
		},
	};
}
