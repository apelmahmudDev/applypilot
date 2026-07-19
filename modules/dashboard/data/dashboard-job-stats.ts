import {
	BriefcaseBusiness,
	CircleCheckBig,
	Sparkles,
	Users,
} from "lucide-react";

import type { StatsCardItem } from "@/modules/dashboard/components/stats-card-grid";
import type { DashboardJob } from "@/modules/dashboard/types";

export function buildAllJobsStats(jobs: DashboardJob[]): StatsCardItem[] {
	const totalJobs = jobs.length;
	const appliedJobs = jobs.filter((job) => job.status === "Applied").length;
	const interviewingJobs = jobs.filter(
		(job) => job.status === "Interview",
	).length;
	const offerJobs = jobs.filter((job) => job.status === "Offer").length;

	return [
		{
			label: "Total Jobs",
			value: String(totalJobs),
			description: "All saved jobs",
			icon: BriefcaseBusiness,
			accentClassName:
				"bg-blue-100 text-blue-700 dark:bg-blue-500/18 dark:text-blue-200",
			trendClassName: "text-blue-600 dark:text-blue-300",
		},
		{
			label: "Applied",
			value: String(appliedJobs),
			description: "Applications sent",
			icon: CircleCheckBig,
			accentClassName:
				"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/18 dark:text-emerald-200",
			trendClassName: "text-emerald-600 dark:text-emerald-300",
		},
		{
			label: "Interview",
			value: String(interviewingJobs),
			description: "In progress",
			icon: Users,
			accentClassName:
				"bg-violet-100 text-violet-700 dark:bg-violet-500/18 dark:text-violet-200",
			trendClassName: "text-violet-600 dark:text-violet-300",
		},
		{
			label: "Offers",
			value: String(offerJobs),
			description: "Offers received",
			icon: Sparkles,
			accentClassName:
				"bg-amber-100 text-amber-700 dark:bg-amber-500/18 dark:text-amber-200",
			trendClassName: "text-amber-600 dark:text-amber-300",
		},
	];
}
