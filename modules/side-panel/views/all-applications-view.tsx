import { Bookmark, Search } from "lucide-react";

import type { StoredJob } from "@/lib/jobs/storage";
import { cn } from "@/lib/utils";
import { RecentJobRow } from "@/modules/side-panel/components/recent-job-row";
import { SectionEmptyState } from "@/modules/side-panel/components/section-empty-state";
import {
	SidePanelBackHeader,
	SidePanelLayout,
	SidePanelTopBar,
} from "@/modules/side-panel/components/side-panel-layout";
import type { ApplicationFilter } from "@/modules/side-panel/types";
import { applicationFilters } from "@/modules/side-panel/utils/constants";
import { mapStoredJobToRecentJob } from "@/modules/side-panel/utils/job-mappers";

type AllApplicationsViewProps = {
	jobs: StoredJob[];
	search: string;
	filter: ApplicationFilter;
	sort: string;
	isDarkMode: boolean;
	onBack: () => void;
	onAddJob: () => void;
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
	onAddJob,
	onSearchChange,
	onFilterChange,
	onSortChange,
	onStatusChange: _onStatusChange,
	onOpenJob,
}: AllApplicationsViewProps) {
	return (
		<SidePanelLayout
			header={
				<SidePanelTopBar
					leftSlot={
						<SidePanelBackHeader
							title="All Applications"
							onBack={onBack}
						/>
					}
					onAddJob={onAddJob}
				/>
			}
		>
			<div className="space-y-3">
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
						"overflow-hidden rounded-md border border-border/70 bg-card transition-colors",
					)}
				>
					{jobs.map((job) => (
						<RecentJobRow
							key={job.id}
							job={mapStoredJobToRecentJob(job)}
							isDarkMode={isDarkMode}
							onOpen={() => onOpenJob(job)}
						/>
					))}
					{!jobs.length && (
						<SectionEmptyState
							icon={Bookmark}
							title="No applications found"
							description="Saved jobs will appear here for quick review and navigation."
						/>
					)}
				</section>
			</div>
		</SidePanelLayout>
	);
}
