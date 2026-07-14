import { useEffect, useState } from "react";
import { format } from "date-fns";

import { analyzeJobUrl, isJobAnalysisAvailable } from "@/lib/job-analysis/service";
import { useJobDetector } from "@/lib/job-detection/use-job-detector";
import type { JobForm } from "@/modules/popup/types";

const emptyJob: JobForm = {
	title: "",
	company: "",
	location: "",
	url: "",
	platform: "Other",
	salary: "",
	currency: "",
	experienceLevel: "Mid-level",
	status: "Saved",
	savedDate: format(new Date(), "yyyy-MM-dd"),
	deadline: "",
	reminderType: "Follow up",
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
	const [isAnalyzing, setIsAnalyzing] = useState(false);

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
			experienceLevel: fallbackJob.experienceLevel,
			status: fallbackJob.status,
			savedDate: fallbackJob.savedDate,
			deadline: fallbackJob.deadline,
			reminderType: fallbackJob.reminderType,
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
		isAnalyzing,
		isAnalysisAvailable: isJobAnalysisAvailable(),
		error: detector.error,
		confidence: detector.job?.confidence ?? null,
		analyzeCurrentJob: async () => {
			setIsAnalyzing(true);
			try {
				const [activeTab] = await browser.tabs.query({
					active: true,
					currentWindow: true,
				});
				const analyzedJob = await analyzeJobUrl(activeTab?.url ?? job.url);
				const nextJob: JobForm = {
					...job,
					title: analyzedJob.title || job.title,
					company: analyzedJob.company || job.company,
					location: analyzedJob.location || job.location,
					url: analyzedJob.url || job.url,
					salary: analyzedJob.salary || job.salary,
					descriptionText: analyzedJob.descriptionText || job.descriptionText,
					employmentType: analyzedJob.employmentType || job.employmentType,
					workplaceType: analyzedJob.workplaceType || job.workplaceType,
					experienceLevel: job.experienceLevel,
					savedDate: job.savedDate,
					reminderType: job.reminderType,
					notes: analyzedJob.descriptionText || job.notes,
				};
				setJob(nextJob);
				return nextJob;
			} finally {
				setIsAnalyzing(false);
			}
		},
	};
}
