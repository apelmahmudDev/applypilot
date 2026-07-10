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
						"flex h-10 items-center gap-2 rounded-[14px] border px-3",
						"border-input bg-card text-muted-foreground",
					)}
				>
					<Search className="size-4 shrink-0" aria-hidden="true" />
					<input
						value={search}
						placeholder="Search jobs..."
						className={cn(
							"min-w-0 flex-1 bg-transparent text-sm font-medium outline-none",
								"text-[#111827] placeholder:text-[#94A3B8]",
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
									? "border-accent bg-accent text-accent-foreground"
									: "border-input bg-card text-muted-foreground hover:text-foreground",
							)}
							onClick={() => onFilterChange(item)}
						>
							{item}
						</button>
					))}
				</div>

				<label
					className={cn(
						"flex items-center justify-between rounded-[14px] border px-3 py-2 text-xs font-semibold",
						"border-input bg-card text-muted-foreground",
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
						"overflow-hidden rounded-[14px] border border-border bg-card",
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
						<p className="px-3 py-4 text-sm text-muted-foreground">
							No applications found.
						</p>
					)}
				</section>
			</div>
			<FullDashboardButton isDarkMode={isDarkMode} />
		</div>
	);
}
