import {
	BriefcaseBusiness,
	CalendarDays,
	ChartNoAxesCombined,
	Trophy,
	Users,
} from "lucide-react";
import { useState } from "react";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	StatsCardGrid,
	type StatsCardItem,
} from "@/modules/dashboard/components/stats-card-grid";
import type { AnalyticsRange } from "@/modules/dashboard/data/dashboard-analytics";
import { useDashboardAnalytics } from "@/modules/dashboard/hooks/use-dashboard-analytics";

import { ApplicationsOverTimeChart } from "../components/analytics/applications-over-time-chart";
import { ApplicationFunnelChart } from "../components/analytics/application-funnel-chart";
import { TopSourcesChart } from "../components/analytics/top-sources-chart";
import { BestPerformingCompaniesCard } from "../components/analytics/best-performing-companies-card";

// import { AnalyticsSummaryMetrics } from "../components/analytics/analytics-summary-metrics";

const analyticsRanges = [
	{ value: "last-30-days", label: "Last 30 days" },
	{ value: "last-90-days", label: "Last 90 days" },
	{ value: "this-year", label: "This year" },
];

export function AnalyticsView() {
	const [range, setRange] = useState<AnalyticsRange>("last-30-days");
	const { analytics } = useDashboardAnalytics(range);
	const analyticsStats: StatsCardItem[] = [
		{
			...analytics.stats.totalApplications,
			icon: BriefcaseBusiness,
		},
		{
			...analytics.stats.responseRate,
			icon: ChartNoAxesCombined,
		},
		{
			...analytics.stats.interviewRate,
			icon: Users,
		},
		{
			...analytics.stats.offers,
			icon: Trophy,
		},
	];

	return (
		<div>
			<section className="mb-5 flex flex-col gap-5 pt-5 pb-2 xl:flex-row xl:items-center xl:justify-between">
				<div className="min-w-0">
					<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950 dark:text-foreground">
						Analytics
					</h1>
					<p className="mt-2 text-sm text-slate-500 dark:text-muted-foreground">
						Track performance and insights across your job search.
					</p>
				</div>

				<div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
					<Select
						value={range}
						onValueChange={(value) => setRange(value as AnalyticsRange)}
					>
						<SelectTrigger className="h-11! w-full bg-white font-semibold shadow-none sm:w-40 dark:border-border dark:bg-card">
							<div className="flex items-center gap-2">
								<CalendarDays className="size-4" aria-hidden="true" />
								<SelectValue />
							</div>
						</SelectTrigger>
						<SelectContent>
							{analyticsRanges.map((range) => (
								<SelectItem key={range.value} value={range.value}>
									{range.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</section>

			<StatsCardGrid stats={analyticsStats} />

			<section className="mt-6 mb-8 space-y-4">
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-12">
					<ApplicationsOverTimeChart data={analytics.applicationsOverTime} />
					<ApplicationFunnelChart data={analytics.applicationFunnel} />
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<TopSourcesChart data={analytics.topSources} />
					<BestPerformingCompaniesCard
						companies={analytics.bestPerformingCompanies}
					/>
				</div>

				{/* <AnalyticsSummaryMetrics /> */}
			</section>
		</div>
	);
}
