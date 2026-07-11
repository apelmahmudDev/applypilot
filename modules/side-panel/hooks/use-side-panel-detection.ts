import { useJobDetector } from "@/lib/job-detection/use-job-detector";

export function useSidePanelDetection() {
	const detector = useJobDetector();

	return {
		job: detector.job
			? {
				title: detector.job.title,
				company: detector.job.company,
				location: detector.job.location,
				url: detector.job.url,
				platform: detector.job.platform || "Other",
				salary: detector.job.salary,
				logoUrl: detector.job.logoUrl,
				employmentType: detector.job.employmentType,
				workplaceType: detector.job.workplaceType,
				status: "Saved" as const,
				deadline: "",
				followUpDate: "",
				followUpTime: "",
				reminderNote: "",
				reminderEnabled: false,
				reminderDone: false,
				descriptionText: detector.job.descriptionText,
				descriptionHtml: detector.job.descriptionHtml,
				notes: detector.job.descriptionText,
			}
			: null,
		isDetecting: detector.isDetecting,
		error: detector.error,
		confidence: detector.job?.confidence ?? null,
		retryDetection: detector.retryDetection,
	};
}
