import { addDays, addMonths, endOfDay, endOfMonth, endOfWeek, format, startOfDay, startOfMonth, subDays } from "date-fns";

import type { StoredJob } from "@/lib/jobs/storage";
import type { StatsCardItem } from "@/modules/dashboard/components/stats-card-grid";

export type AnalyticsRange = "last-30-days" | "last-90-days" | "this-year";

export type AnalyticsSummaryStat = Omit<StatsCardItem, "icon">;

export type ApplicationsOverTimePoint = {
	label: string;
	applications: number;
};

export type ApplicationFunnelPoint = {
	stage: "Saved" | "Applied" | "Interview" | "Offer";
	value: number;
	percentage: number;
	fill: string;
};

export type TopSourcePoint = {
	source: string;
	applications: number;
};

export type BestPerformingCompanyPoint = {
	company: string;
	applications: number;
	interviewRate: string;
	accentClassName: string;
};

export type DashboardAnalytics = {
	stats: {
		totalApplications: AnalyticsSummaryStat;
		responseRate: AnalyticsSummaryStat;
		interviewRate: AnalyticsSummaryStat;
		offers: AnalyticsSummaryStat;
	};
	applicationsOverTime: ApplicationsOverTimePoint[];
	applicationFunnel: ApplicationFunnelPoint[];
	topSources: TopSourcePoint[];
	bestPerformingCompanies: BestPerformingCompanyPoint[];
};

type AnalyticsPeriod = {
	start: Date;
	end: Date;
	previousStart: Date;
	previousEnd: Date;
	description: string;
};

const funnelColors = {
	Saved: "#c7d7ff",
	Applied: "#b9f0c9",
	Interview: "#d9c8ff",
	Offer: "#ffd79b",
} as const;

const companyAccentClasses = [
	"bg-slate-950 text-white dark:bg-slate-800 dark:text-slate-100",
	"bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200",
	"bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200",
	"bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200",
	"bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200",
];

export function buildDashboardAnalytics(
	jobs: StoredJob[],
	range: AnalyticsRange,
	now = new Date(),
): DashboardAnalytics {
	const period = getAnalyticsPeriod(range, now);
	const currentJobs = jobs.filter((job) => isJobInPeriod(job, period.start, period.end));
	const previousJobs = jobs.filter((job) =>
		isJobInPeriod(job, period.previousStart, period.previousEnd),
	);

	const currentTrackedCount = currentJobs.length;
	const previousTrackedCount = previousJobs.length;
	const currentAppliedCount = countAppliedOrLater(currentJobs);
	const previousAppliedCount = countAppliedOrLater(previousJobs);
	const currentInterviewCount = countInterviewOrLater(currentJobs);
	const previousInterviewCount = countInterviewOrLater(previousJobs);
	const currentOfferCount = countOffers(currentJobs);
	const previousOfferCount = countOffers(previousJobs);

	return {
		stats: {
			totalApplications: {
				label: "Total Applications",
				value: String(currentTrackedCount),
				description: period.description,
				trend: formatCountTrend(currentTrackedCount, previousTrackedCount),
				accentClassName:
					"bg-blue-50 text-blue-600 dark:bg-blue-500/18 dark:text-blue-200",
				trendClassName: getTrendClassName(currentTrackedCount, previousTrackedCount),
			},
			responseRate: {
				label: "Response Rate",
				value: formatPercentage(
					calculateRate(currentInterviewCount, currentAppliedCount),
				),
				description: period.description,
				trend: formatRateTrend(
					calculateRate(currentInterviewCount, currentAppliedCount),
					calculateRate(previousInterviewCount, previousAppliedCount),
				),
				accentClassName:
					"bg-emerald-50 text-emerald-600 dark:bg-emerald-500/18 dark:text-emerald-200",
				trendClassName: getTrendClassName(
					calculateRate(currentInterviewCount, currentAppliedCount),
					calculateRate(previousInterviewCount, previousAppliedCount),
				),
			},
			interviewRate: {
				label: "Interview Rate",
				value: formatPercentage(
					calculateRate(currentInterviewCount, currentTrackedCount),
				),
				description: period.description,
				trend: formatRateTrend(
					calculateRate(currentInterviewCount, currentTrackedCount),
					calculateRate(previousInterviewCount, previousTrackedCount),
				),
				accentClassName:
					"bg-violet-50 text-violet-600 dark:bg-violet-500/18 dark:text-violet-200",
				trendClassName: getTrendClassName(
					calculateRate(currentInterviewCount, currentTrackedCount),
					calculateRate(previousInterviewCount, previousTrackedCount),
				),
			},
			offers: {
				label: "Offers",
				value: String(currentOfferCount),
				description: period.description,
				trend: formatCountTrend(currentOfferCount, previousOfferCount),
				accentClassName:
					"bg-amber-50 text-amber-500 dark:bg-amber-500/18 dark:text-amber-200",
				trendClassName: getTrendClassName(currentOfferCount, previousOfferCount),
			},
		},
		applicationsOverTime: buildApplicationsOverTimeData(currentJobs, range, period),
		applicationFunnel: buildApplicationFunnelData(
			currentTrackedCount,
			currentAppliedCount,
			currentInterviewCount,
			currentOfferCount,
		),
		topSources: buildTopSourcesData(currentJobs),
		bestPerformingCompanies: buildBestPerformingCompanies(currentJobs),
	};
}

function buildApplicationsOverTimeData(
	jobs: StoredJob[],
	range: AnalyticsRange,
	period: AnalyticsPeriod,
) {
	const segments =
		range === "this-year"
			? createMonthlySegments(period.start, period.end)
			: createWeeklySegments(period.start, period.end);

	return segments.map(({ start, end, label }) => ({
		label,
		applications: jobs.filter((job) => isJobInPeriod(job, start, end)).length,
	}));
}

function buildApplicationFunnelData(
	totalCount: number,
	appliedCount: number,
	interviewCount: number,
	offerCount: number,
): ApplicationFunnelPoint[] {
	return [
		createFunnelPoint("Saved", totalCount, totalCount),
		createFunnelPoint("Applied", appliedCount, totalCount),
		createFunnelPoint("Interview", interviewCount, totalCount),
		createFunnelPoint("Offer", offerCount, totalCount),
	];
}

function buildTopSourcesData(jobs: StoredJob[]): TopSourcePoint[] {
	const counts = new Map<string, number>();

	for (const job of jobs) {
		const source = inferSourceLabel(job);
		counts.set(source, (counts.get(source) ?? 0) + 1);
	}

	return Array.from(counts.entries())
		.map(([source, applications]) => ({ source, applications }))
		.sort((first, second) => second.applications - first.applications)
		.slice(0, 5);
}

function buildBestPerformingCompanies(
	jobs: StoredJob[],
): BestPerformingCompanyPoint[] {
	const companyStats = new Map<
		string,
		{ applications: number; interviews: number }
	>();

	for (const job of jobs) {
		const company = job.company.trim() || "Unknown company";
		const current = companyStats.get(company) ?? { applications: 0, interviews: 0 };
		current.applications += 1;
		if (isInterviewOrLater(job)) {
			current.interviews += 1;
		}
		companyStats.set(company, current);
	}

	return Array.from(companyStats.entries())
		.map(([company, stats]) => ({
			company,
			applications: stats.applications,
			interviewRateValue: calculateRate(stats.interviews, stats.applications),
		}))
		.sort((first, second) => {
			if (second.interviewRateValue !== first.interviewRateValue) {
				return second.interviewRateValue - first.interviewRateValue;
			}

			if (second.applications !== first.applications) {
				return second.applications - first.applications;
			}

			return first.company.localeCompare(second.company);
		})
		.slice(0, 5)
		.map((company, index) => ({
			company: company.company,
			applications: company.applications,
			interviewRate: formatPercentage(company.interviewRateValue),
			accentClassName:
				companyAccentClasses[index % companyAccentClasses.length],
		}));
}

function createFunnelPoint(
	stage: ApplicationFunnelPoint["stage"],
	value: number,
	totalCount: number,
): ApplicationFunnelPoint {
	return {
		stage,
		value,
		percentage: totalCount > 0 ? roundToOneDecimal((value / totalCount) * 100) : 0,
		fill: funnelColors[stage],
	};
}

function getAnalyticsPeriod(range: AnalyticsRange, now: Date): AnalyticsPeriod {
	const today = startOfDay(now);

	if (range === "last-90-days") {
		const end = endOfDay(now);
		const start = startOfDay(subDays(today, 89));
		const previousEnd = endOfDay(subDays(start, 1));
		const previousStart = startOfDay(subDays(previousEnd, 89));

		return {
			start,
			end,
			previousStart,
			previousEnd,
			description: "vs previous 90 days",
		};
	}

	if (range === "this-year") {
		const start = startOfMonth(new Date(now.getFullYear(), 0, 1));
		const end = endOfDay(now);
		const previousEnd = endOfDay(subDays(start, 1));
		const previousStart = startOfMonth(new Date(start.getFullYear() - 1, 0, 1));

		return {
			start,
			end,
			previousStart,
			previousEnd,
			description: "vs previous year",
		};
	}

	const end = endOfDay(now);
	const start = startOfDay(subDays(today, 29));
	const previousEnd = endOfDay(subDays(start, 1));
	const previousStart = startOfDay(subDays(previousEnd, 29));

	return {
		start,
		end,
		previousStart,
		previousEnd,
		description: "vs previous 30 days",
	};
}

function createWeeklySegments(start: Date, end: Date) {
	const segments: Array<{ start: Date; end: Date; label: string }> = [];
	let cursor = start;

	while (cursor <= end) {
		const segmentEnd = minDate(endOfWeek(cursor), end);
		segments.push({
			start: cursor,
			end: segmentEnd,
			label: formatWeeklyLabel(cursor, segmentEnd),
		});
		cursor = startOfDay(addDays(segmentEnd, 1));
	}

	return segments;
}

function createMonthlySegments(start: Date, end: Date) {
	const segments: Array<{ start: Date; end: Date; label: string }> = [];
	let cursor = start;

	while (cursor <= end) {
		const segmentEnd = minDate(endOfMonth(cursor), end);
		segments.push({
			start: cursor,
			end: segmentEnd,
			label: format(cursor, "MMM"),
		});
		cursor = startOfDay(addMonths(cursor, 1));
	}

	return segments;
}

function formatWeeklyLabel(start: Date, end: Date) {
	const startLabel = format(start, "MMM d");
	const endLabel =
		start.getMonth() === end.getMonth()
			? format(end, "d")
			: format(end, "MMM d");

	return `${startLabel}-${endLabel}`;
}

function isJobInPeriod(job: StoredJob, start: Date, end: Date) {
	const date = getTrackedDate(job);

	if (!date) {
		return false;
	}

	return date >= start && date <= end;
}

function getTrackedDate(job: StoredJob) {
	const source =
		job.savedDate || job.createdAt || job.updatedAt || "";
	const parsed = parseStoredDate(source);
	return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function parseStoredDate(value: string) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		return new Date(`${value}T12:00:00`);
	}

	return new Date(value);
}

function countAppliedOrLater(jobs: StoredJob[]) {
	return jobs.filter((job) => job.status !== "Saved").length;
}

function countInterviewOrLater(jobs: StoredJob[]) {
	return jobs.filter(isInterviewOrLater).length;
}

function countOffers(jobs: StoredJob[]) {
	return jobs.filter((job) => job.status === "Offer").length;
}

function isInterviewOrLater(job: StoredJob) {
	return job.status === "Interviewing" || job.status === "Offer";
}

function inferSourceLabel(job: StoredJob) {
	const combined = `${job.platform} ${job.url}`.toLowerCase();

	if (combined.includes("linkedin")) return "LinkedIn";
	if (combined.includes("indeed")) return "Indeed";
	if (!job.platform.trim() && !job.url.trim()) return "Manual";
	if (job.platform.trim().toLowerCase() === "manual") return "Manual";
	return "Company Site";
}

function calculateRate(numerator: number, denominator: number) {
	if (denominator <= 0) {
		return 0;
	}

	return (numerator / denominator) * 100;
}

function formatPercentage(value: number) {
	return `${roundToOneDecimal(value)}%`;
}

function formatCountTrend(current: number, previous: number) {
	return formatSignedTrend(previous === 0 ? current : current - previous);
}

function formatRateTrend(current: number, previous: number) {
	return `${formatSignedTrend(roundToOneDecimal(current - previous))} pts`;
}

function formatSignedTrend(value: number) {
	if (value === 0) {
		return "0";
	}

	return `${value > 0 ? "+" : ""}${value}`;
}

function getTrendClassName(current: number, previous: number) {
	if (current < previous) {
		return "text-rose-500 dark:text-rose-300";
	}

	return "text-emerald-600 dark:text-emerald-300";
}

function roundToOneDecimal(value: number) {
	return Math.round(value * 10) / 10;
}

function minDate(first: Date, second: Date) {
	return first.getTime() <= second.getTime() ? first : second;
}
