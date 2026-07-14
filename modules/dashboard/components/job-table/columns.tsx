import type { ColumnDef } from "@tanstack/react-table";
import { Bell, Globe } from "lucide-react";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type {
	DashboardJob,
	DashboardJobStatus,
	DashboardStatusFilter,
} from "@/modules/dashboard/types";
import { DataTableRowActions } from "./data-table-row-actions";
import { JobBrandMark } from "./job-brand-mark";

const statusStyles: Record<DashboardJobStatus, string> = {
	Applied: "bg-emerald-50 text-emerald-600",
	Interview: "bg-violet-50 text-violet-600",
	Saved: "bg-blue-50 text-blue-600",
	Rejected: "bg-red-50 text-red-600",
	Offer: "bg-amber-50 text-amber-600",
};

type DashboardColumnsOptions = {
	showStatus?: boolean;
	statusFilter?: DashboardStatusFilter;
	onViewDetails?: (job: DashboardJob) => void;
	onSetReminder?: (job: DashboardJob) => void;
	onEditJob?: (job: DashboardJob) => void;
};

export function getDashboardColumns({
	showStatus = true,
	statusFilter = "all",
	onViewDetails,
	onSetReminder,
	onEditJob,
}: DashboardColumnsOptions = {}): ColumnDef<DashboardJob>[] {
	const dateColumnLabel = getDateColumnLabel(statusFilter);

	const columns: ColumnDef<DashboardJob>[] = [
		{
			accessorKey: "title",
			header: "Job Title",
			cell: ({ row }) => {
				const job = row.original;
				return (
					<div className="min-w-[220px]">
						<p className="truncate text-sm font-bold text-slate-950">
							{job.title}
						</p>
						<p className="mt-1 truncate text-xs font-medium text-slate-500">
							{job.jobType}
						</p>
					</div>
				);
			},
		},
		{
			accessorKey: "company",
			header: "Company",
			cell: ({ row }) => {
				const job = row.original;
				return (
					<div className="flex min-w-[150px] items-center gap-3">
						<JobBrandMark brand={job.brand} />
						<p className="truncate text-sm font-semibold text-slate-900">
							{job.company}
						</p>
					</div>
				);
			},
		},
		{
			accessorKey: "location",
			header: "Location",
			cell: ({ row }) => {
				const job = row.original;
				return (
					<div className="min-w-[150px]">
						<p className="text-sm font-semibold text-slate-900">{job.location}</p>
						<p className="mt-1 text-xs font-medium text-slate-500">
							{job.workMode}
						</p>
					</div>
				);
			},
		},
		{
			accessorKey: "source",
			header: "Source",
			cell: ({ row }) => <SourceCell job={row.original} />,
		},
	];

	if (showStatus) {
		columns.push({
			accessorKey: "status",
			header: "Status",
			cell: ({ row }) => (
				<span
					className={cn(
						"inline-flex min-w-20 justify-center rounded-full px-3 py-1 text-xs font-bold",
						statusStyles[row.original.status],
					)}
				>
					{row.original.status}
				</span>
			),
			filterFn: (row, id, value) => {
				if (value === "all") {
					return true;
				}

				return String(row.getValue(id)).toLowerCase() === value;
			},
		});
	}

	columns.push(
		{
			accessorKey: "appliedDate",
			header: dateColumnLabel,
			cell: ({ row }) => (
				<p className="min-w-[110px] text-sm font-medium text-slate-700">
					{row.original.appliedDate}
				</p>
			),
		},
		{
			accessorKey: "reminder",
			header: "Reminder",
			cell: ({ row }) => (
				<div className="min-w-[90px]">
					{row.original.reminder === "-" ? (
						<span className="text-sm font-medium text-slate-400">-</span>
					) : (
						<span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500">
							<Bell className="size-3.5" />
							{row.original.reminder}
						</span>
					)}
				</div>
			),
		},
		{
			id: "actions",
			header: () => (
				<div className="flex min-w-[76px] justify-end text-right">Actions</div>
			),
			cell: ({ row }) => (
				<DataTableRowActions
					job={row.original}
					onViewDetails={onViewDetails}
					onSetReminder={onSetReminder}
					onEditJob={onEditJob}
				/>
			),
		},
	);

	return columns;
}

function getDateColumnLabel(statusFilter: DashboardStatusFilter) {
	if (statusFilter === "saved") return "Saved Date";
	if (statusFilter === "rejected") return "Rejected Date";
	if (statusFilter === "offer") return "Offer Date";
	if (statusFilter === "applied") return "Applied Date";
	if (statusFilter === "interview") return "Interview Date";

	return "Date Added";
}

function SourceCell({ job }: { job: DashboardJob }) {
	const extensionChrome = globalThis as typeof globalThis & {
		chrome?: {
			tabs?: {
				create: (options: { url: string }) => void;
			};
		};
	};
	const isDisabled = !job.source.url;
	const title = job.source.name === "Manual" ? "Manual" : "Open Job Link";

	const handleOpenSource = () => {
		if (!job.source.url) {
			return;
		}

		extensionChrome.chrome?.tabs?.create({ url: job.source.url });
	};

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						onClick={handleOpenSource}
						disabled={isDisabled}
						aria-label={title}
						className={cn(
							"flex size-8 items-center justify-center rounded-md transition-colors",
							isDisabled
								? "cursor-not-allowed text-slate-400"
								: "hover:bg-slate-100 hover:text-slate-950",
						)}
					>
						{job.source.faviconUrl ? (
							<img
								src={job.source.faviconUrl}
								alt=""
								className="size-4 rounded-sm object-cover"
							/>
						) : job.source.name === "Manual" ? (
							<span className="inline-flex size-4 items-center justify-center rounded-[4px] bg-slate-100 text-[10px] font-black uppercase text-slate-500">
								M
							</span>
						) : (
							<Globe className="size-4 text-slate-500" />
						)}
					</button>
				</TooltipTrigger>
				<TooltipContent side="top" sideOffset={6}>
					{title}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
