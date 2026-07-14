import {
	BriefcaseBusiness,
	CalendarDays,
	ChartNoAxesCombined,
	Trophy,
	Users,
} from "lucide-react";

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

const analyticsStats = [
	{
		label: "Total Applications",
		value: "56",
		description: "vs previous 30 days",
		trend: "16%",
		icon: BriefcaseBusiness,
		accentClassName:
			"bg-blue-50 text-blue-600 dark:bg-blue-500/18 dark:text-blue-200",
		trendClassName: "text-emerald-600 dark:text-emerald-300",
	},
	{
		label: "Response Rate",
		value: "28.6%",
		description: "vs previous 30 days",
		trend: "8.4%",
		icon: ChartNoAxesCombined,
		accentClassName:
			"bg-emerald-50 text-emerald-600 dark:bg-emerald-500/18 dark:text-emerald-200",
		trendClassName: "text-emerald-600 dark:text-emerald-300",
	},
	{
		label: "Interview Rate",
		value: "17.9%",
		description: "vs previous 30 days",
		trend: "5.1%",
		icon: Users,
		accentClassName:
			"bg-violet-50 text-violet-600 dark:bg-violet-500/18 dark:text-violet-200",
		trendClassName: "text-emerald-600 dark:text-emerald-300",
	},
	{
		label: "Offers",
		value: "5",
		description: "vs previous 30 days",
		trend: "2",
		icon: Trophy,
		accentClassName:
			"bg-amber-50 text-amber-500 dark:bg-amber-500/18 dark:text-amber-200",
		trendClassName: "text-emerald-600 dark:text-emerald-300",
	},
] satisfies StatsCardItem[];

export function AnalyticsView() {
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
					<Select defaultValue="last-30-days">
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
					<ApplicationsOverTimeChart />
					<ApplicationFunnelChart />
				</div>

				<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
					<TopSourcesChart />
					<BestPerformingCompaniesCard />
				</div>

				{/* <AnalyticsSummaryMetrics /> */}
			</section>
		</div>
	);
}
