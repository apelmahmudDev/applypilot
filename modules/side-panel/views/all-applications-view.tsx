import { Search } from "lucide-react";

import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { ApplicationJobRow } from "@/modules/side-panel/components/application-job-row";
import { FullDashboardButton } from "@/modules/side-panel/components/full-dashboard-button";
import { ViewHeader } from "@/modules/side-panel/components/view-header";
import type { ApplicationFilter } from "@/modules/side-panel/types";
import { applicationFilters } from "@/modules/side-panel/utils/constants";

type AllApplicationsViewProps = {
	jobs: StoredJob[];
	search: string;
	filter: ApplicationFilter;
	sort: string;
	isDarkMode: boolean;
	onBack: () => void;
	onSearchChange: (value: string) => void;
	onFilterChange: (value: ApplicationFilter) => void;
	onSortChange: (value: string) => void;
	onStatusChange: (job: StoredJob) => void;
	onOpenJob: (job: StoredJob) => void;
};

export function AllApplicationsView({
	jobs,
	search,
	filter,
	sort,
	isDarkMode,
	onBack,
	onSearchChange,
	onFilterChange,
	onSortChange,
	onStatusChange,
	onOpenJob,
}: AllApplicationsViewProps) {
	return (
		<div className="flex min-h-0 flex-1 flex-col px-4 pb-4 pt-4">
			<ViewHeader title="All Applications" isDarkMode={isDarkMode} onBack={onBack} />
			<div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
				<div
					className={cn(
						"flex h-10 items-center gap-2 rounded-lg border px-3",
						isDarkMode
							? "border-slate-700/70 bg-[#262628] text-slate-400"
							: "border-slate-200 bg-white text-slate-500",
					)}
				>
					<Search className="size-4 shrink-0" aria-hidden="true" />
					<input
						value={search}
						placeholder="Search jobs..."
						className={cn(
							"min-w-0 flex-1 bg-transparent text-sm font-medium outline-none",
							isDarkMode
								? "text-slate-100 placeholder:text-slate-500"
								: "text-slate-950 placeholder:text-slate-400",
						)}
						onChange={(event) => onSearchChange(event.target.value)}
					/>
				</div>

				<div className="flex gap-2 overflow-x-auto pb-1">
					{applicationFilters.map((item) => (
						<button
							key={item}
							type="button"
							className={cn(
								"shrink-0 rounded-md border px-3 py-1.5 text-xs font-semibold transition",
								filter === item
									? isDarkMode
										? "border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
										: "border-blue-100 bg-blue-50 text-blue-700"
									: isDarkMode
										? "border-slate-700 bg-[#262628] text-slate-400 hover:text-slate-200"
										: "border-slate-200 bg-white text-slate-500 hover:text-slate-900",
							)}
							onClick={() => onFilterChange(item)}
						>
							{item}
						</button>
					))}
				</div>

				<label
					className={cn(
						"flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold",
						isDarkMode
							? "border-slate-700 bg-[#262628] text-slate-300"
							: "border-slate-200 bg-white text-slate-600",
					)}
				>
					<span>Sort</span>
					<select
						value={sort}
						className="bg-transparent text-sm font-semibold outline-none"
						onChange={(event) => onSortChange(event.target.value)}
					>
						<option value="latest">Latest</option>
						<option value="company">Company</option>
						<option value="status">Status</option>
					</select>
				</label>

				<section
					className={cn(
						"overflow-hidden rounded-lg border",
						isDarkMode
							? "border-slate-700/65 bg-[#262628]"
							: "border-slate-200 bg-white",
					)}
				>
					{jobs.map((job) => (
						<ApplicationJobRow
							key={job.id}
							job={job}
							isDarkMode={isDarkMode}
							onStatusChange={() => onStatusChange(job)}
							onOpen={() => onOpenJob(job)}
						/>
					))}
					{!jobs.length && (
						<p className={cn("px-3 py-4 text-sm", isDarkMode ? "text-slate-400" : "text-slate-500")}>
							No applications found.
						</p>
					)}
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
