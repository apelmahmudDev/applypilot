export const applicationsOverTimeData = [
	{ label: "Apr 21-27", applications: 7 },
	{ label: "Apr 28-May 4", applications: 11 },
	{ label: "May 5-11", applications: 18 },
	{ label: "May 12-18", applications: 27 },
	{ label: "May 19-25", applications: 33 },
	{ label: "May 26-Jun 1", applications: 56 },
];

export const applicationFunnelData = [
	{ stage: "Saved", value: 56, percentage: 100, fill: "#c7d7ff" },
	{ stage: "Applied", value: 42, percentage: 75, fill: "#b9f0c9" },
	{ stage: "Interview", value: 10, percentage: 17.9, fill: "#d9c8ff" },
	{ stage: "Offer", value: 5, percentage: 8.9, fill: "#ffd79b" },
];

export const applicationsByStatusData = [
	{ name: "Applied", value: 42, percentage: "75.0%", fill: "#2563eb" },
	{ name: "Interview", value: 10, percentage: "17.9%", fill: "#8b5cf6" },
	{ name: "Offer", value: 5, percentage: "8.9%", fill: "#f59e0b" },
];

export const topSourcesData = [
	{ source: "LinkedIn", applications: 18 },
	{ source: "Company Site", applications: 13 },
	{ source: "Wellfound", applications: 8 },
	{ source: "Indeed", applications: 6 },
	{ source: "Referral", applications: 4 },
];

export const bestPerformingCompanies = [
	{
		company: "OpenAI",
		applications: 2,
		interviewRate: "100%",
		accentClassName: "bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100",
	},
	{
		company: "Linear",
		applications: 2,
		interviewRate: "50%",
		accentClassName:
			"bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-100",
	},
	{
		company: "Notion",
		applications: 3,
		interviewRate: "33.3%",
		accentClassName: "bg-neutral-950 text-white",
	},
	{
		company: "Figma",
		applications: 3,
		interviewRate: "33.3%",
		accentClassName: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-200",
	},
	{
		company: "Stripe",
		applications: 2,
		interviewRate: "0%",
		accentClassName:
			"bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200",
	},
];

export const analyticsSummaryMetrics = [
	{
		label: "Avg. time to response",
		value: "6.4 days",
		trend: "1.2 days",
		trendDirection: "down" as const,
		trendClassName: "text-emerald-600",
		accentClassName: "bg-blue-50 text-blue-600",
	},
	{
		label: "Follow-ups due",
		value: "8",
		trend: "2",
		trendDirection: "up" as const,
		trendClassName: "text-rose-500",
		accentClassName: "bg-rose-50 text-rose-500",
	},
	{
		label: "Conversion Rate",
		value: "8.9%",
		trend: "1.6%",
		trendDirection: "up" as const,
		trendClassName: "text-emerald-600",
		accentClassName: "bg-violet-50 text-violet-600",
	},
	{
		label: "Applications / week",
		value: "11.2",
		trend: "1.8",
		trendDirection: "up" as const,
		trendClassName: "text-emerald-600",
		accentClassName: "bg-emerald-50 text-emerald-600",
	},
	{
		label: "Most active day",
		value: "Tuesday",
		trend: "",
		trendDirection: "up" as const,
		trendClassName: "text-slate-500",
		accentClassName: "bg-blue-50 text-blue-600",
	},
];
