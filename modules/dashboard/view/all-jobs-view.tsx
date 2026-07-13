import {
	BriefcaseBusiness,
	CircleCheckBig,
	Plus,
	Search,
	Sparkles,
	Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { dashboardJobs } from "@/modules/dashboard/mock-data";
import {
	StatsCardGrid,
	type StatsCardItem,
} from "@/modules/dashboard/components/stats-card-grid";
import type { DashboardStatusFilter } from "@/modules/dashboard/types";
import { getDashboardColumns } from "../components/job-table/columns";
import { DataTable } from "../components/job-table/data-table";

const statusFilters: Array<{ value: DashboardStatusFilter; label: string }> = [
	{ value: "saved", label: "Saved" },
	{ value: "applied", label: "Applied" },
	{ value: "interview", label: "Interview" },
	{ value: "rejected", label: "Rejected" },
	{ value: "offer", label: "Offer" },
];

const allJobsStats = [
	{
		label: "Total Jobs",
		value: "42",
		description: "All saved jobs",
		trend: "12%",
		icon: BriefcaseBusiness,
		accentClassName: "bg-blue-50 text-blue-600",
		trendClassName: "text-blue-600",
	},
	{
		label: "Applied",
		value: "18",
		description: "Applications sent",
		trend: "18%",
		icon: CircleCheckBig,
		accentClassName: "bg-emerald-50 text-emerald-600",
		trendClassName: "text-emerald-600",
	},
	{
		label: "Interviewing",
		value: "4",
		description: "In progress",
		trend: "14%",
		icon: Users,
		accentClassName: "bg-violet-50 text-violet-600",
		trendClassName: "text-violet-600",
	},
	{
		label: "Offers",
		value: "1",
		description: "Offers received",
		trend: "50%",
		icon: Sparkles,
		accentClassName: "bg-amber-50 text-amber-500",
		trendClassName: "text-amber-500",
	},
] satisfies StatsCardItem[];

export function AllJobsView() {
	return (
		<DataTable
			columns={({ statusFilter }) =>
				getDashboardColumns({
					showStatus: false,
					statusFilter,
				})
			}
			data={dashboardJobs}
			toolbarMode="tabs-only"
			showStatusTabs={false}
			initialStatusFilter="saved"
			headerSlot={({ statusFilter, setStatusFilter }) => (
				<section className="flex flex-col gap-5 pt-5 pb-2 xl:flex-row xl:items-center xl:justify-between">
					<div className="min-w-0">
						<h1 className="text-3xl font-bold tracking-[-0.05em] text-slate-950">
							All Jobs
						</h1>
						<p className="mt-2 text-sm text-slate-500">
							Track and manage all your job applications in one place.
						</p>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center xl:justify-end">
						<div className="relative w-full sm:w-[20rem] xl:w-[22rem]">
							<Search
								className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400"
								aria-hidden="true"
							/>
							<Input
								placeholder="Search jobs, companies, roles..."
								className="h-11 bg-white pl-11 pr-14 text-sm shadow-none"
							/>
						</div>

						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setStatusFilter(value as DashboardStatusFilter)
							}
						>
							<SelectTrigger className="h-11! w-full bg-white font-semibold sm:w-40 shadow-none">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{statusFilters.map((filter) => (
									<SelectItem key={filter.value} value={filter.value}>
										{filter.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Button className="h-11 px-4">
							<Plus className="size-4" aria-hidden="true" />
							Save New Job
						</Button>
					</div>
				</section>
			)}
			statsSlot={<StatsCardGrid stats={allJobsStats} />}
		/>
	);
}
