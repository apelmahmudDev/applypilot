import { useEffect, useState } from "react";

import { useJobDetector } from "@/lib/job-detection/use-job-detector";
import type { DetectionConfidence } from "@/lib/job-detection/types";
import type { JobForm } from "@/modules/popup/types";

const emptyJob: JobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "Other",
	salary: "",
	status: "Interested",
	deadline: "",
	followUpDate: "",
	followUpTime: "",
	reminderNote: "",
	reminderEnabled: false,
	reminderDone: false,
	notes: "",
};

export function useDetectedJob(fallbackJob: JobForm = emptyJob) {
	const detector = useJobDetector();
	const [job, setJob] = useState<JobForm>(fallbackJob);

	useEffect(() => {
		if (!detector.job) {
			setJob(fallbackJob);
			return;
		}

		setJob({
			title: detector.job.title ?? "",
			company: detector.job.company ?? "",
			location: detector.job.location ?? "",
			url: detector.job.url ?? "",
			platform: detector.job.platform || "Other",
			salary: detector.job.salary ?? "",
			logoUrl: detector.job.logoUrl ?? "",
			descriptionText: detector.job.descriptionText ?? "",
			descriptionHtml: detector.job.descriptionHtml ?? "",
			employmentType: detector.job.employmentType ?? "",
			workplaceType: detector.job.workplaceType ?? "",
			status: fallbackJob.status,
			deadline: fallbackJob.deadline,
			followUpDate: fallbackJob.followUpDate,
			followUpTime: fallbackJob.followUpTime,
			reminderNote: fallbackJob.reminderNote,
			reminderEnabled: fallbackJob.reminderEnabled,
			reminderDone: fallbackJob.reminderDone,
			notes: detector.job.descriptionText ?? "",
		});
	}, [detector.job, fallbackJob]);

	return {
		job,
		setJob,
		isDetecting: detector.isDetecting,
		error: detector.error,
		confidence: detector.job?.confidence ?? null,
	};
}
